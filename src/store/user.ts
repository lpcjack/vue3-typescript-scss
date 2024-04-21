import {defineStore} from 'pinia'
import {loginRegister} from "./login-register.ts";
import {getData, store} from "./persistStore.ts";

export const useUser = defineStore("user", {
    // State 相当于组件中的 data属性
    state: () => ({

        // 找到好友
        searchFriendName: '',
        // 用户是否登录
        flag: false,

        // 用户id
        userId: '',
        // 存储邀请好友信息
        InviteInformation: [] as any,

        // 存储不在该群聊的好友
        NotInTheGroup: [] as any,

        // 添加好友返回结果
        Result: '',

        // 存储好友添加以及群聊邀请信息
        Information: [] as any,

        // 存储在线好友
        OnlineFriends: [] as any,

        //接收后端传回来的好友信息
        friendName: '',


        //文件url
        fileUrl: '',
        //图片url
        imageUrl1: '',


        // 账号昵称
        nickname: '',

        //群聊名称
        groupnickname: '',
        //当前选中的群聊
        currentGroupInfo:{}  as any, // 鼠标当前选中的群聊
        //群聊消息列表
        groupListInfo: [] as any,//列表中的群聊


        // 好友信息
        friendsInfo: {} as any, //鼠标选中的好友
        // 好友列表 + 好友消息
        friendsListInfo: [] as any, //列表中的好友

        //接收到的图片数据
        receivedImage: '' as string,

        //存放个人群聊信息渲染
        personalGroupDisplay: [] as any,

        // WebSocket 实例
        webSocketInstance: null as any,
    }),
    // Getters 相当于组件中的 计算属性
    getters: {},
    // Actions 相当于组件中的 methods
    actions: {


        // 创建 WebSocket 实例连接
        //createWebSocket为异步函数，返回Promise对象
        async createWebSocket(nickname: string ) {
            // 验证是否存在实例 存在则先关闭
            if (this.webSocketInstance) {
                this.webSocketInstance.close();
            }
            //resolve 和 reject 视为两个回调函数。
            //构造一个Promise对象
            return new Promise((resolve, reject) => {

                //确保昵称不为空
                if (!nickname) {
                    reject('')
                    return
                }

                const loginStore = loginRegister()
                // 设置用户id
                this.userId = loginStore.userID
                // 设置用户昵称
                this.nickname = nickname
                // 建立WebSocket全双工通信链接
                this.webSocketInstance = new WebSocket('ws://127.0.0.1:8080/websocket/' + nickname)

                // 检测刷新或者网页关闭后，数据存储到localstorage
                store(this.userId, this.friendsListInfo, this.personalGroupDisplay)


                //<editor-fold desc="WebSocket事件监听">
                // 监听WebSocket打开事件
                this.webSocketInstance.onopen = () => {
                    this.flag = true
                    console.log('WebSocket is connected');
                    resolve(true)
                };
                

                // 监听WebSocket消息事件
                this.webSocketInstance.onmessage = (event: any) => {
                    // 接收消息转JSON对象
                    //event.data是接受的消息
                    const data = JSON.parse(event.data)
                    console.log("收到的信息是："+JSON.stringify(data))
                    //更新好友列表
                    //只是渲染到前端界面上
                    if (data.type === 'updateFriendsList') {
                        this.updateFriends(data)
                    }
                    //更新群聊列表
                    //渲染到前端页面上
                    else if (data.type === 'update-group'){
                        this.updateGroup(data)
                    }
                    // 更新不在群聊信息
                    else if (data.type === 'update-information'){
                        this.NotInTheGroup = []
                        const dataInformation = JSON.parse(data.messages)
                        if(dataInformation != null){
                            // 遍历 parsedObject 的键值对，转换成 group 对象的形式并存储在 NotInTheGroup 中
                            for (const groupName in dataInformation) {
                                if (dataInformation.hasOwnProperty(groupName)) {
                                    const groupData = {
                                        groupName: groupName,
                                        members: dataInformation[groupName]
                                    }
                                    this.NotInTheGroup.push(groupData)
                                }
                            }
                        }


                    }


                    // 发送添加好友请求
                    else if(data.type === 'information'){
                        const friend = {
                            friendname: data.messages,
                        } as any
                        this.Information.push(friend)

                    }

                    // 发送邀请好友请求
                    else if(data.type === 'InviteFriends'){
                        const invite = {
                            // 邀请加入的群聊
                            groupName: data.groupName,
                            // 邀请者
                            Inviter: data.inviter,
                        }
                        this.InviteInformation.push(invite)
                    }

                    // 好友上线更新
                    else if (data.type === 'friendOnline'){
                        // 在线就将该好友添加到在线好友数组中
                        const friend = {
                            friend: data.messages,
                        }
                        // 将好友信息存储到在线好友列表中
                        this.OnlineFriends.push(friend)
                        for (let i = 0; i < this.friendsListInfo.length; i++){
                            let findIndex = this.friendsListInfo.findIndex((object: any) => object.nickname === data.messages);
                            // 存在代表已经上线
                            this.friendsListInfo[findIndex].status = true
                            // 验证是否为当前选择好友信息
                            if (this.friendsInfo.nickname === data.messages) {
                                // 更新当前好友的在线状态 更新在线
                                this.friendsInfo.status = true
                            }
                        }


                    }

                    // 好友离线更新
                    else if (data.type === 'friendOffline'){
                        // 离线就将该好友从在线好友数组中移除
                        // 移除值为 data.messages 的元素
                        this.OnlineFriends = this.OnlineFriends.filter((friend: { friend: any }) => friend.friend !== data.messages);

                        // 设置为离线状态
                        for (let i = 0; i < this.friendsListInfo.length; i++){
                            let findIndexOffline = this.friendsListInfo.findIndex((object: any) => object.nickname === data.messages);
                            // 存在代表已经上线
                            this.friendsListInfo[findIndexOffline].status = false
                            // 验证是否为当前选择好友信息
                            if (this.friendsInfo.nickname === data.messages) {
                                // 更新当前好友的在线状态 更新在线
                                this.friendsInfo.status = false
                            }
                        }



                    }

                    // 群聊长度更新
                    else if(data.type === 'updateGroupNumber'){
                        for (let i = 1; i < this.personalGroupDisplay.length; i++){
                            if(data.groupName === this.personalGroupDisplay[i].groupname){
                                this.personalGroupDisplay[i].groupNumber = data.groupLength
                            }
                        }
                    }

                    // 接受错误信息
                    // 点击添加按钮出现异常
                    else if(data.type === 'AddErr'){
                        if(data.messagesSort === 'repeatAdd'){
                            this.Result = 'repeatAdd'
                        }
                        else if(data.messagesSort === 'noPerson'){
                            this.Result = 'noPerson'
                        }
                    }

                    // 群聊实时刷新到界面
                    else if(data.type === 'createGroup'){
                        let group = {
                            // 群名
                            groupname: data.groupName,
                            // 群成员
                            groupMember: data.messages,
                            // 群长度
                            groupNumber: data.messages.length,
                            // 最新消息
                            latestNews: '',
                            // 存放群聊消息集合
                            messages: [
                                {

                                }
                            ] as any
                        }
                        // 存入个人群聊列表
                        this.personalGroupDisplay.push(group)
                    }




                    else if (data.type === 'messages' ) {
                        //寻找发送消息在好友列表中的索引
                        let findIndex = this.friendsListInfo.findIndex((object: any) => object.nickname === data.sendNickname);

                        //如果找到了该好友，则进入该模块
                        if (findIndex !== -1) {
                            //this.friendsListInfo[findIndex].nickname表示找到的好友在好友列表中的昵称
                            //this.friendsInfo.nickname当前选中好友的昵称
                            if (this.friendsListInfo[findIndex].nickname === this.friendsInfo.nickname){
                                this.friendsInfo.latestNews = data.messages
                                //将接收到的消息内容 data.messages 添加到当前选中好友的消息记录中，用于保存整个聊天的消息历史。
                                //this.friendsInfo.messages 是一个数组，用于存储当前选中好友的所有消息记录。
                                this.friendsInfo.messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'text',//文本消息
                                    message: data.messages// 消息内容
                                })
                            }

                            //不是选中的好友

                            else {
                                this.friendsListInfo[findIndex].latestNews = data.messages
                                this.friendsListInfo[findIndex].messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'text',//文本消息
                                    message: data.messages// 消息内容
                                })
                            }

                        }

                    }
                    //接受图片信息
                    else if (data.type === 'image'){
                        //寻找发送消息在好友列表中的索引
                        let findIndex1 = this.friendsListInfo.findIndex((object: any) => object.nickname === data.sendNickname);

                        //如果找到了该好友，则进入该模块
                        if (findIndex1 !== -1) {
                            //this.friendsListInfo[findIndex].nickname表示找到的好友在好友列表中的昵称
                            //this.friendsInfo.nickname当前选中好友的昵称
                            if (this.friendsListInfo[findIndex1].nickname === this.friendsInfo.nickname){
                                this.friendsInfo.latestNews = '[图片类型暂时无法预览]'
                                //将接收到的消息内容 data.messages 添加到当前选中好友的消息记录中，用于保存整个聊天的消息历史。
                                //this.friendsInfo.messages 是一个数组，用于存储当前选中好友的所有消息记录。
                                this.friendsInfo.messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'image',//图片类型
                                    message: data.messages// 消息内容
                                })
                            }

                            //不是选中的好友

                            else {
                                this.friendsListInfo[findIndex1].latestNews = '[图片类型暂时无法预览]'
                                this.friendsListInfo[findIndex1].messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'image',//图片类型
                                    message: data.messages// 消息内容
                                })
                            }

                        }
                    }
                    else if(data.type === 'file'){
                        //寻找发送消息在好友列表中的索引
                        let findIndex2 = this.friendsListInfo.findIndex((object: any) => object.nickname === data.sendNickname);

                        //如果找到了该好友，则进入该模块
                        if (findIndex2 !== -1) {
                            //this.friendsListInfo[findIndex].nickname表示找到的好友在好友列表中的昵称
                            //this.friendsInfo.nickname当前选中好友的昵称
                            if (this.friendsListInfo[findIndex2].nickname === this.friendsInfo.nickname){
                                this.friendsInfo.latestNews = '[文件类型暂时无法预览]'
                                //将接收到的消息内容 data.messages 添加到当前选中好友的消息记录中，用于保存整个聊天的消息历史。
                                //this.friendsInfo.messages 是一个数组，用于存储当前选中好友的所有消息记录。
                                this.friendsInfo.messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'file',//图片类型
                                    message: data.messages// 消息内容
                                })
                            }

                            //不是选中的好友

                            else {
                                this.friendsListInfo[findIndex2].latestNews = '[文件类型暂时无法预览]'
                                this.friendsListInfo[findIndex2].messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'file',//图片类型
                                    message: data.messages// 消息内容
                                })
                            }

                        }
                    }

                    //群聊消息
                    else if(data.type === "group-message"){

                        //寻找发送消息在群聊列表中的索引
                        let findIndex1 = this.personalGroupDisplay.findIndex((object: any) => object.groupname === data.groupnickname);

                        //如果找到了该群聊，则进入该模块
                        if (findIndex1 !== -1) {

                            if (this.personalGroupDisplay[findIndex1].groupname === this.currentGroupInfo.groupnickname){
                                this.currentGroupInfo.latestNews = data.messages
                                this.currentGroupInfo.messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'text',//文本消息
                                    message: data.messages// 消息内容
                                })
                            }

                            //不是选中的群聊

                            else {
                                this.personalGroupDisplay[findIndex1].latestNews = data.messages
                                this.personalGroupDisplay[findIndex1].messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'text',//文本消息
                                    message: data.messages// 消息内容
                                })
                            }

                        }
                    }
                    else if (data.type === 'group-image'){
                        //寻找发送消息在好友列表中的索引
                        let findIndex2 = this.personalGroupDisplay.findIndex((object: any) => object.groupname === data.groupnickname);

                        //如果找到了该群聊，则进入该模块
                        if (findIndex2 !== -1) {

                            if (this.personalGroupDisplay[findIndex2].groupname === this.currentGroupInfo.groupnickname){
                                this.currentGroupInfo.latestNews = '[图片类型暂时无法预览]'
                                //将接收到的消息内容 data.messages 添加到当前选中好友的消息记录中，用于保存整个聊天的消息历史。
                                //this.friendsInfo.messages 是一个数组，用于存储当前选中好友的所有消息记录。
                                this.currentGroupInfo.messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'image',//文本消息
                                    message: data.messages// 消息内容
                                })
                            }

                            //不是选中的群聊

                            else {
                                this.personalGroupDisplay[findIndex2].latestNews = '[图片类型暂时无法预览]'
                                this.personalGroupDisplay[findIndex2].messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'image',//文本消息
                                    message: data.messages// 消息内容
                                })
                            }

                        }
                    }
                    else if (data.type === 'group-file'){
                        //寻找发送消息在好友列表中的索引
                        let findIndex3 = this.personalGroupDisplay.findIndex((object: any) => object.groupname === data.groupnickname);

                        //如果找到了该群聊，则进入该模块
                        if (findIndex3 !== -1) {

                            if (this.personalGroupDisplay[findIndex3].groupname === this.currentGroupInfo.groupnickname){
                                this.currentGroupInfo.latestNews = '[文件类型暂时无法预览]'
                                //将接收到的消息内容 data.messages 添加到当前选中好友的消息记录中，用于保存整个聊天的消息历史。
                                //this.friendsInfo.messages 是一个数组，用于存储当前选中好友的所有消息记录。
                                this.currentGroupInfo.messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'file',//文本消息
                                    message: data.messages// 消息内容
                                })
                            }

                            //不是选中的群聊

                            else {
                                this.personalGroupDisplay[findIndex3].latestNews = '[文件类型暂时无法预览]'
                                this.personalGroupDisplay[findIndex3].messages.push({
                                    type: 'friend', // 消息类型
                                    sort: 'file',//文本消息
                                    message: data.messages// 消息内容
                                })
                            }

                        }
                    }
                    else if (data.type === 'addAgree'){
                        let friend = {
                            // 原本是true
                            // 是否在线状态
                            status: data.status,
                            // 好友账号昵称
                            nickname: data.messages,
                            // 最新消息
                            latestNews: '',
                            // 消息集合
                            messages: [
                                // {
                                //     type: 'friend', // 消息类型
                                //     sort: 'text',
                                //     message: '好友已经上线可以开始聊天了' // 消息内容
                                // }
                            ] as any
                        }
                        // 存入好友信息列表
                        this.friendsListInfo.push(friend)
                    }

                    else if(data.type === 'AgreeToGroup'){
                        let group = {
                            // 群名
                            groupname: data.groupName,
                            // 群成员
                            groupMember: data.member,
                            // 群长度
                            groupNumber: data.groupLength,
                            // 最新消息
                            latestNews: '',
                            // 存放群聊消息集合
                            messages: [
                                {

                                }
                            ] as any
                        }
                        this.personalGroupDisplay.push(group)
                    }


                };


                // 监听WebSocket关闭事件
                this.webSocketInstance.onclose = () => {
                    console.log('WebSocket is disconnected');
                    resolve(false)

                };


                // 监听WebSocket异常事件
                this.webSocketInstance.onerror = (error: any) => {
                    console.error('WebSocket error:', error);
                    reject(error)
                };


                //</editor-fold>
            })
        },

        //更新群聊内的内容
        //预留函数
        async updateGroup(data: any){
            const database = JSON.parse(data.messages)
            for (const groupName in database){
                if(database.hasOwnProperty(groupName)){
                    const group = {
                        // 群名
                        groupname: groupName,
                        // 群成员
                        groupMember: database[groupName],
                        // 群长度
                        groupNumber: database[groupName].length,
                        // 最新消息
                        latestNews: '',
                        // 存放群聊消息集合
                        messages: [
                            {


                            }
                        ] as any
                    }
                    // 存储到列表中
                    this.personalGroupDisplay.push(group)
                }
            }

            const storedata = getData(this.userId)
            // 赋值数据
            if(storedata != null){
                for (let i = 0; i < storedata.personalGroupDisplay.length; i++){
                    this.personalGroupDisplay[i].messages = storedata.personalGroupDisplay[i].messages
                    this.personalGroupDisplay[i].latestNews = storedata.personalGroupDisplay[i].latestNews
                }
            }


        },

        async updateFriends(data: any) {

            for (let i = 0; i < data.messages.length; i++) {
                let friend = {
                    // 原来是true
                    status: false, // 是否在线状态
                    nickname: data.messages[i], // 好友账号昵称
                    latestNews: '', // 最新消息
                    // 消息集合
                    messages: [
                        // {
                        //     type: 'friend', // 消息类型
                        //     sort: 'text',
                        //     message: '好友已经上线可以开始聊天了' // 消息内容
                        // }
                    ] as any
                }
                this.friendsListInfo.push(friend)
            }

            const storedata = getData(this.userId)
            // 赋值数据
            if(storedata != null){
                for(let i = 0; i < storedata.friendsListInfo.length; i++){
                    this.friendsListInfo[i].latestNews = storedata.friendsListInfo[i].latestNews
                    this.friendsListInfo[i].messages = storedata.friendsListInfo[i].messages
                }
            }

        },

        //发送文本消息
        //这段代码用于通过 WebSocket 发送消息，并更新用户界面中的消息列表和最新消息。
        async sendMessages(receiveMessage: string) {
            if (!this.friendsInfo.nickname) {
                return false
            }
            /*
            创建一个 message 对象，包含了消息的类型（"messages"）、发送者昵称、接收者昵称以及消息内容
             */
            let message = {
                type: "messages",
                //发送者昵称
                sendNickname: this.nickname,
                //接收者的昵称
                receiveNickname: this.friendsInfo.nickname,
                //消息内容
                messages: receiveMessage
            }
            //通过 WebSocket 实例向服务器发送消息。
            this.webSocketInstance.send(JSON.stringify(message))

            let addMessage = {
                type: 'my', // 消息类型
                sort: 'text',//文本消息
                message: receiveMessage// 消息内容
            }
            //将新发送的消息添加到当前选择的好友的消息集合中。
            this.friendsInfo.messages.push(addMessage)

            //更新当前选择的好友的最新消息为刚发送的消息内容。
            this.friendsInfo.latestNews = receiveMessage
            //返回 true 表示消息发送成功。
            return true
        },

        async sendGroupMessages(receiveMessage: string) {
            if (!this.currentGroupInfo.groupname) {
                console.log("这里并没有群聊，代码出错！！！");
                return false;
            }

            // 创建一个群聊消息对象
            let groupmessage = {
                type: "group-message",
                groupnickname: this.currentGroupInfo.groupname,
                sendNickname: this.nickname,
                messages: receiveMessage // 省略 receiveNickname 字段
            };
            this.webSocketInstance.send(JSON.stringify(groupmessage))

            let addgroupMessage = {
                type: 'my',
                sort: 'text',
                message: receiveMessage
            };

            // 将新发送的消息添加到当前选择的群聊的消息集合中
            this.currentGroupInfo.messages.push(addgroupMessage);

            // 更新当前选择群聊的最新消息为刚发送的消息内容
            this.currentGroupInfo.latestNews = receiveMessage;
            return true;
        },

        //发送文本消息
        //这段代码用于通过 WebSocket 发送消息，并更新用户界面中的消息列表和最新消息。
        async sendMessagesImage(receiveMessage: string) {
            //确定存在此人
            if (!this.friendsInfo.nickname) {
                return false
            }
            /*
            创建一个 message 对象，包含了消息的类型（"messages"）、发送者昵称、接收者昵称以及消息内容
             */
            let Imagemessage = {

                type: "image",
                //发送者昵称
                sendNickname: this.nickname,
                //接收者的昵称
                receiveNickname: this.friendsInfo.nickname,
                //消息内容
                messages: receiveMessage
            }
            //通过 WebSocket 实例向服务器发送消息。
            this.webSocketInstance.send(JSON.stringify(Imagemessage))

            let addMessage = {
                type: 'my', // 消息类型
                sort: 'image',
                message: receiveMessage// 消息内容
            }
            //将新发送的消息添加到当前选择的好友的消息集合中。
            this.friendsInfo.messages.push(addMessage)
            //更新当前选择的好友的最新消息为刚发送的消息内容。
            this.friendsInfo.latestNews = '[图片类型暂时无法预览]'
            //返回 true 表示消息发送成功。
            return true
        },


        //fetch抓取图片
        async picUpload(f: File){
            let params = new FormData()
            params.append("file", f);
            const response = await fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: params
            })

            const data: string = await response.text();
            this.imageUrl1 = data
            console.log(this.imageUrl1)
        },

        //fetch抓取文件
        async picUploadfile(f: File){
            let params = new FormData()
            params.append("file", f);
            const response = await fetch('http://localhost:8080/api/uploadfile', {
                method: 'POST',
                body: params
            })

            const data: string = await response.text();
            this.fileUrl = data
            console.log(this.fileUrl)
        },

        async sendMessagesFile(receiveMessage: string) {
            //确定存在此人
            if (!this.friendsInfo.nickname) {
                return false
            }
            /*
            创建一个 message 对象，包含了消息的类型（"messages"）、发送者昵称、接收者昵称以及消息内容
             */
            let Filemessage = {

                type: "file",
                //发送者昵称
                sendNickname: this.nickname,
                //接收者的昵称
                receiveNickname: this.friendsInfo.nickname,
                //消息内容
                messages: receiveMessage
            }
            //通过 WebSocket 实例向服务器发送消息。
            this.webSocketInstance.send(JSON.stringify(Filemessage))

            let addMessage = {
                type: 'my', // 消息类型
                sort: 'file',
                message: receiveMessage// 消息内容
            }
            //将新发送的消息添加到当前选择的好友的消息集合中。
            this.friendsInfo.messages.push(addMessage)
            //更新当前选择的好友的最新消息为刚发送的消息内容。
            this.friendsInfo.latestNews = '[文件类型暂时无法预览]'
            //返回 true 表示消息发送成功。
            return true
        },


        //群发图片
        async sendGroupImage(receiveMessage: string) {
            if (!this.currentGroupInfo.groupname) {
                console.log("这里没有群聊");
                return false;
            }

            let groupImage = {
                type: "group-image",
                groupnickname: this.currentGroupInfo.groupname,
                sendNickname: this.nickname,
                messages: receiveMessage // 省略 receiveNickname 字段
            };
            this.webSocketInstance.send(JSON.stringify(groupImage))

            let addgroupMessage = {
                type: 'my',
                sort: 'image',
                message: receiveMessage
            };

            // 将新发送的消息添加到当前选择的群聊的消息集合中
            this.currentGroupInfo.messages.push(addgroupMessage);
            this.currentGroupInfo.latestNews = '[图片类型暂时无法预览]'
            return true;
        },


        //发送文件
        async sendGroupFile(receiveMessage: string) {
            if (!this.currentGroupInfo.groupname) {
                console.log("这里没有群聊");
                return false;
            }

            let groupFilemessage = {
                type: "group-file",
                groupnickname: this.currentGroupInfo.groupname,
                sendNickname: this.nickname,
                messages: receiveMessage // 省略 receiveNickname 字段
            };
            this.webSocketInstance.send(JSON.stringify(groupFilemessage))

            let addgroupMessage = {
                type: 'my',
                sort: 'file',
                message: receiveMessage
            };
            // 将新发送的消息添加到当前选择的群聊的消息集合中
            this.currentGroupInfo.messages.push(addgroupMessage);
            this.currentGroupInfo.latestNews = '[文件类型暂时无法预览]'
            return true;
        },


        //查找是否存在该好友
        async findFriends(friendname: string): Promise<string> {
            const data = {
                username: this.nickname,
                friendName: friendname,
            };
            try {
                const response = await fetch('http://localhost:8080/api/searchFriend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const responseData: string = await response.text();
                if (responseData != 'ban') {
                    if(responseData != 'NotFound'){
                        const  json = JSON.parse(responseData);
                        this.friendName = json.friendName
                        return 'findOut'
                    }
                    else{
                        return 'NotFound'
                    }
                }
                // 如果为搜索自己 禁止
                else{
                    return 'prohibition';
                }
            } catch (error) {
                throw new Error('请求错误:' + error);
            }
        },


        // 实时添加好友
        async addFriend(friendName: string){
            const friend = {
                type: 'addFriend',
                //发送者昵称
                sendNickname: this.nickname,
                //消息内容
                messages: friendName,
                // 好友在线状态
                status: true,
            }
            this.webSocketInstance.send(JSON.stringify(friend))
            return true
        },


        // 实时创建群聊
        async createGroup(GroupName: string , members: any []){
            if(GroupName === null || members === null){
                return false
            }
            const group = {
                type: 'createGroup',
                //创建人昵称
                creator: this.nickname,
                // 群名
                groupName: GroupName,
                //消息内容
                messages: members,
            }
            this.webSocketInstance.send(JSON.stringify(group))
            return true
        },


        // 好友点击同意后给服务器发送信息
        // 对方发送同意
        async addAgree(friendName: string){
            const friend = {
                type: "addAgree",
                // 发送者昵称
                sendNickname: this.nickname,
                // 消息内容
                messages: friendName,
                // 在线状态
                status: true,
            }
            this.webSocketInstance.send(JSON.stringify(friend))
            // 返回真
            return true
        },


        // 邀请好友进入群聊
        async InvieFriends(groupName: string , member: any []){
            if(groupName === null || member === null){
                return false
            }
            const invite = {
                type: "InviteFriends",
                // 邀请者
                Inviter: this.nickname,
                // 邀请加入的群聊
                groupName: groupName,
                // 邀请的人
                messages: member,
            }
            this.webSocketInstance.send(JSON.stringify(invite))
            // 返回真
            return true
        },

        // 同意好友请求
        async AgreeToTheGroup(groupName: string ,inviter: string){
            if(groupName == null || inviter == null){
                return false
            }
            const agree = {
                type: 'AgreeToGroup',
                // 邀请者
                Inviter: inviter,
                //群名
                groupName: groupName,
                //接收者
                receiver: this.nickname,
            }
            this.webSocketInstance.send(JSON.stringify(agree));
            return true;
        },

        // 搜索好友
        async searchFd(friendName: string){
            try {
               // 发送请求
               const data = {
                   friendName: friendName,
                   userName: this.nickname,
               }
               const response = await fetch('http://localhost:8080/api/searchFD',{
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(data)
               })
                const respData: string = await response.text();
                const parseData = JSON.parse(respData)
                if(parseData.type === 'Found'){
                    this.searchFriendName = parseData.friendName
                    return true
                }
                else {
                    return false
                }

            }catch (error) {
                throw new Error('请求错误:' + error);
            }
        },



    },
})