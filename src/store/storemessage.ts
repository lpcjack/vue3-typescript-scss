import {defineStore} from "pinia";

export const storemessage = defineStore("storeMessage" , {
    state:() => ({

    }),
    getters: {},
    actions:{
        async storemsg(sender: string , receiver: string , message: string , type: string ){
            fetch('http://localhost:8080/api/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({sender, receiver , message , type})
            })
                .then(response => {
                    if (response.ok) {
                        // 请求成功
                        console.log('存储成功');
                    } else {
                        // 请求失败
                        console.log('存储失败');
                    }
                })
                .catch(error => {
                    console.error('发生错误:', error);
                })
        },

    }



})