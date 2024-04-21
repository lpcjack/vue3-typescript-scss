import {defineStore} from "pinia";

export const CreateGroup = defineStore("creategroup",{
    state:() =>({
        groupname: '',
        members: [] as any,
        groupmessages: [] as any,

        //为每一个群聊创建一个对象
        grouplistInfo: [] as any,
    }),
    getters: {},
    actions: {

        async  creategroup(groupname: string, members: any[]): Promise<boolean> {
            const params = {
                groupname: groupname,
                members: members,
            };
            if(groupname === null || members === null){
                return false;
            }

            try {
                const response = await fetch('http://localhost:8080/api/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                });

                if (response.ok) {
                    const data = await response.json();
                    const receivedata = JSON.stringify(data);
                    console.log("群聊具体信息为：" + receivedata);
                    return true;
                } else {
                    console.error('服务器响应错误:', response.statusText);
                    return false;
                }
            } catch (error) {
                console.error('请求发送失败:', error);
                return false;
            }
        }




    }
})