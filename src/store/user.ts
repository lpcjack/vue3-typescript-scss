import {defineStore} from 'pinia'


export const useUser = defineStore("user", {
    // State 相当于组件中的 data属性
    state: () => ({

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


        // WebSocket 实例
        webSocketInstance: null as any,
    }),
    // Getters 相当于组件中的 计算属性
    getters: {},
    // Actions 相当于组件中的 methods
    actions: {

        //*************************************
        //创建群聊函数
        //*************************************

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


                // 设置用户昵称
                this.nickname = nickname
                // 建立WebSocket全双工通信链接
                this.webSocketInstance = new WebSocket('ws://127.0.0.1:8080/websocket/' + nickname)


                //<editor-fold desc="WebSocket事件监听">
                // 监听WebSocket打开事件
                this.webSocketInstance.onopen = () => {
                    console.log('WebSocket is connected');
                    resolve(true)
                };
                

                // 监听WebSocket消息事件
                this.webSocketInstance.onmessage = (event: any) => {
                    // 接收消息转JSON对象
                    //event.data是接受的消息
                    const data = JSON.parse(event.data)
                    //console.log(data)

                    //更新好友列表
                    if (data.type === 'updateFriendsList') {
                        this.updateFriends(data)
                    }
                    //更新群聊列表
                    else if (data.type === 'update-group'){
                        this.updateGroup(data)
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
                                this.friendsInfo.latestNews = data.messages
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
                                this.friendsListInfo[findIndex1].latestNews = data.messages
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
                                this.friendsInfo.latestNews = data.messages
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
                                this.friendsListInfo[findIndex2].latestNews = data.messages
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
                        //寻找发送消息在好友列表中的索引
                        let findIndex = this.groupListInfo.findIndex((object: any) => object.groupnickname === '打雷');

                        //如果找到了该好友，则进入该模块
                        if (findIndex !== -1) {
                            // if (this.friendsListInfo[findIndex].nickname === this.friendsInfo.nickname){
                            //     this.friendsInfo.latestNews = data.messages
                            //     //将接收到的消息内容 data.messages 添加到当前选中好友的消息记录中，用于保存整个聊天的消息历史。
                            //     //this.friendsInfo.messages 是一个数组，用于存储当前选中好友的所有消息记录。
                            //     this.friendsInfo.messages.push({
                            //         type: 'friend', // 消息类型
                            //         message: data.messages// 消息内容
                            //     })
                            // }
                            //
                            // //不是选中的好友
                            //
                            // else {
                            //     this.friendsListInfo[findIndex].latestNews = data.messages
                            //     this.friendsListInfo[findIndex].messages.push({
                            //         type: 'friend', // 消息类型
                            //         message: data.messages// 消息内容
                            //     })
                            // }
                            this.groupListInfo[findIndex].latestNews = data.messages
                            this.groupListInfo[findIndex].messages.push({
                                type: 'group-friend',
                                groupmessage: data.messages,
                            })

                        }else {
                            console.log("抱歉，没有该群聊！！！！！")
                        }
                    }
                    // else if (data.type === 'group-image'){
                    //     //寻找群聊
                    //     let findIndex1 = this.groupListInfo.findIndex((object: any) => object.groupnickname === '打雷');
                    //
                    //     //如果找到了该群聊，则进入该模块
                    //     if (findIndex1 !== -1) {
                    //
                    //         this.groupListInfo[findIndex1].latestNews = data.messages
                    //         this.groupListInfo[findIndex1].messages.push({
                    //             type: 'group-friend',
                    //             sort: 'image',
                    //             groupmessage: data.messages,
                    //         })
                    //
                    //     }else {
                    //         console.log("抱歉，没有该群聊！！！！！")
                    //     }
                    // }
                    else if(data.type === 'createGroup'){
                        let group = {} as any;
                        group = {
                            groupnickname: data.groupnickname ,
                            latestNews: '',
                            messages: [{
                                type: 'createGroup',
                                groupmessage: '欢迎来到该群聊' + data.groupnickname + '!!!!!',
                            }] as any
                        }
                        this.groupListInfo.push(group)

                        // console.log(JSON.stringify(this.groupListInfo[0]))
                    }

                    else if (data.type === 'creategroup'){
                        // let group = {
                        //     //群名
                        //     groupnickname: data.groupName,
                        //     //群成员
                        //     messages: [{
                        //         type:'creategroup' ,
                        //         groupmessage: ,
                        //     }] as any
                        // }

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
            for (let i = 0; i < data.messages.length; i++) {
                let group = {
                    groupnickname: data.groupnickname ,
                    latestNews: data.messages[i].nickname + '已经上线，我们可以聊天了！！！' ,
                    messages : [
                        {
                            type: 'group-friend' ,
                            sort: 'text',
                            groupmessage: data.messages[i].nickname + '已经上线，我们可以聊天了！！！' ,
                        }
                    ] as any
                }
                this.currentGroupInfo = group;

            }

        },

        async updateFriends(data: any) {
            // 验证是否存在好友，好友列表不为空
            if (this.friendsListInfo.length > 0) {

                // 迭代更新的好友列表信息
                //data.messages是一个数组，里边储存除了自己以外的其他人的账号/昵称
                for (let i = 0; i < data.messages.length; i++) {
                    let findIndex = this.friendsListInfo.findIndex((object: any) => object.nickname === data.messages[i].nickname);
                    // 验证是否一致
                    // 不一致 新增好友
                    if (findIndex === -1) {
                        let friend = {
                            status: true, // 是否在线状态
                            nickname: data.messages[i].nickname, // 好友账号昵称
                            latestNews: '好友已经上线可以开始聊天了', // 最新消息
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

                        //测试输出
                        console.log(JSON.stringify(friend))
                    }
                }

                // 迭代已经存储的好友列表
                //更新在线与离线的状态
                for (let i = 0; i < this.friendsListInfo.length; i++) {
                    // 查找好友
                    // 移除或者修改在线状态
                    let findIndex1 = data.messages.findIndex((object: any) => object.nickname === this.friendsListInfo[i].nickname);

                    //离线
                    if (findIndex1 == -1) {
                        // 不存在代表已经离线
                        this.friendsListInfo[i].status = false
                        // 验证是否为当前选择好友信息
                        if (this.friendsInfo.nickname === this.friendsListInfo[i].nickname) {
                            // 更新当前选择好友的在线状态 更新离线
                            this.friendsInfo.status = false
                        }
                    }

                    //在线
                    else {
                        // 存在代表已经上线
                        this.friendsListInfo[i].status = true
                        // 验证是否为当前选择好友信息
                        if (this.friendsInfo.nickname === data.messages[findIndex1].nickname) {
                            // 更新当前好友的在线状态 更新在线
                            this.friendsInfo.status = true
                        }
                    }

                }

            }
            //好友列表为空新增初始化第一个好友
            else {
                let friend = {} as any;
                // 迭代初始化好友列表信息
                //data.messages为接收消息数组
                for (let i = 0; i < data.messages.length; i++) {
                    friend = {
                        status: true, // 是否在线状态
                        nickname: data.messages[i].nickname, // 好友账号昵称
                        latestNews: '好友已经上线可以开始聊天了', // 最新消息
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

                    //测试输出
                    console.log(JSON.stringify(friend))
                }

                /*
                这部分代码的目的是在当前用户的好友列表中没有好友信息时，将接收到的第一个好友信息作为默认选择的好友，并更新 this.friendsInfo。
                具体解释如下：
                if (data.messages.length > 0)：检查接收到的消息数组是否包含至少一个好友信息。
                如果条件成立，表示有好友信息，进入 if 语句块：
                创建一个名为 friend 的对象，该对象包含了默认的好友信息，包括在线状态、昵称、最新消息和一个包含初始消息的消息集合。
                this.friendsInfo = friend：将刚创建的 friend 对象赋值给 this.friendsInfo，从而将其设置为当前用户选择的默认好友。
                总体而言，这段代码的目的是初始化用户的好友列表，如果有好友信息，则选择第一个好友作为默认好友，并将其信息存储在 this.friendsInfo 中。
                 */
                // 默认选择第一个好友信息
                if (data.messages.length > 0) {
                    friend = {
                        status: true, // 是否在线状态
                        nickname: data.messages[0].nickname, // 好友账号昵称
                        latestNews: '好友已经上线可以开始聊天了', // 最新消息
                        // 消息集合
                        messages: [
                            // {
                            //     type: 'friend', // 消息类型
                            //     sort: 'text',
                            //     message: '好友已经上线可以开始聊天了' // 消息内容
                            // }
                        ] as any
                    }
                    //默认选中第一个好友
                    this.friendsInfo = friend

                    //测试输出
                    console.log(JSON.stringify(friend))
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
            console.log(message)

            let addMessage = {
                type: 'my', // 消息类型
                sort: 'text',//文本消息
                message: receiveMessage// 消息内容
            }
            //将新发送的消息添加到当前选择的好友的消息集合中。
            this.friendsInfo.messages.push(addMessage)
            console.log(JSON.stringify(this.friendsInfo))
            //更新当前选择的好友的最新消息为刚发送的消息内容。
            this.friendsInfo.latestNews = receiveMessage
            //返回 true 表示消息发送成功。
            return true
        },

        async sendGroupMessages(receiveMessage: string) {
            if (!this.currentGroupInfo.groupnickname) {
                console.log("这里没有群聊");
                return false;
            }

            // const sendPromises = this.friendsListInfo.map(() => {
            //     let groupmessage = {
            //         type: "group-message",
            //         sendNickname: this.nickname,
            //         messages: receiveMessage // 省略 receiveNickname 字段
            //     };
            //     return new Promise(resolve => {
            //         this.webSocketInstance.send(JSON.stringify(groupmessage), resolve);
            //     });
            // });
            //
            // await Promise.all(sendPromises);
            let groupmessage = {
                type: "group-message",
                sendNickname: this.nickname,
                messages: receiveMessage // 省略 receiveNickname 字段
            };
            this.webSocketInstance.send(JSON.stringify(groupmessage))

            let addgroupMessage = {
                type: 'group-my',
                sort: 'text',
                groupmessage: receiveMessage
            };

            // 将新发送的消息添加到当前选择的群聊的消息集合中
            this.currentGroupInfo.messages.push(addgroupMessage);

            // console.log(JSON.stringify(this.currentGroupInfo))
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
            console.log(Imagemessage)

            let addMessage = {
                type: 'my', // 消息类型
                sort: 'image',
                message: receiveMessage// 消息内容
            }
            //将新发送的消息添加到当前选择的好友的消息集合中。
            this.friendsInfo.messages.push(addMessage)
            console.log(JSON.stringify(this.friendsInfo))
            //更新当前选择的好友的最新消息为刚发送的消息内容。
            this.friendsInfo.latestNews = receiveMessage
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
            console.log(Filemessage)

            let addMessage = {
                type: 'my', // 消息类型
                sort: 'file',
                message: receiveMessage// 消息内容
            }
            //将新发送的消息添加到当前选择的好友的消息集合中。
            this.friendsInfo.messages.push(addMessage)
            console.log(JSON.stringify(this.friendsInfo))
            //更新当前选择的好友的最新消息为刚发送的消息内容。
            this.friendsInfo.latestNews = receiveMessage
            //返回 true 表示消息发送成功。
            return true
        },


        //群发图片
        async sendGroupImage(receiveMessage: string) {
            if (!this.currentGroupInfo.groupnickname) {
                console.log("这里没有群聊");
                return false;
            }

            let groupImage = {
                type: "group-image",
                sendNickname: this.nickname,
                messages: receiveMessage // 省略 receiveNickname 字段
            };
            this.webSocketInstance.send(JSON.stringify(groupImage))

            let addgroupMessage = {
                type: 'group-my',
                sort: 'image',
                groupmessage: receiveMessage
            };

            // 将新发送的消息添加到当前选择的群聊的消息集合中
            this.currentGroupInfo.messages.push(addgroupMessage);

            // console.log(JSON.stringify(this.currentGroupInfo))
            // 更新当前选择群聊的最新消息为刚发送的消息内容
            this.currentGroupInfo.latestNews = receiveMessage;
            return true;
        },


        //发送文件
        async sendGroupFile(receiveMessage: string) {
            if (!this.currentGroupInfo.groupnickname) {
                console.log("这里没有群聊");
                return false;
            }

            let groupFilemessage = {
                type: "group-file",
                sendNickname: this.nickname,
                messages: receiveMessage // 省略 receiveNickname 字段
            };
            this.webSocketInstance.send(JSON.stringify(groupFilemessage))

            let addgroupMessage = {
                type: 'group-my',
                sort: 'file',
                groupmessage: receiveMessage
            };

            // 将新发送的消息添加到当前选择的群聊的消息集合中
            this.currentGroupInfo.messages.push(addgroupMessage);
            // console.log(JSON.stringify(this.currentGroupInfo))
            // 更新当前选择群聊的最新消息为刚发送的消息内容
            this.currentGroupInfo.latestNews = receiveMessage;
            return true;
        },


        //创建群聊
        //往后端发送请求
        async createGroupres(groupname: string , member: []){
            let create = {
                type: 'creategroup',
                //群名
                groupName: groupname,
                //创建者
                sendNickname: this.nickname,
                //群成员
                message: member,
            }
            //发送创建群聊请求
            this.webSocketInstance.send(JSON.stringify(create))
        },


    },
})