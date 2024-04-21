import {defineStore} from "pinia";

export const loginRegister =defineStore("login-register",{
    state:() =>({
        // 登录标志
        loginFlag: '',
        // 账号昵称
        nickname: '',
        //密码
        password: '',
        // 用户id
        userID: '',

    }),
    getters: {},
    actions:{

        //注册账号密码并存储到数据库
        async loginexam(nickname: string , password: string){
             try {
                 // 构造一个对象
                 const dataForm = {
                     nickname: nickname,
                     password: password,
                 }
                 const response = await fetch('http://localhost:8080/api/sign', {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(dataForm)
                 })

                 const data: string = await response.text()
                 const receiveData = JSON.parse(data)
                 if (receiveData.type === 'success') {
                     this.userID = receiveData.userId
                     this.nickname = receiveData.nickname
                     this.password = receiveData.password
                     return 'success';
                 } else if (receiveData.type === 'repeat') {
                     return 'repeat';
                 }else {
                     return 'error';
                 }

             }catch (error){
                 throw new Error('请求错误:' + error)
             }

        },


        //后端密码登陆验证
        async loginsql(nickname: string , password: string , verifycode: string){
            try {
                // 构造一个对象
                const log = {
                    nickname: nickname,
                    password: password,
                    verifycode: verifycode,

                }
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(log),
                    credentials: 'include'  // 确保包含cookies
                });
                // 接收返回的数据
                const data: string = await response.text();
                const json = JSON.parse(data);
                if (json.type === 'success') {
                    this.nickname = json.nickname
                    this.password = json.password
                    this.userID = json.userID
                    // 验证成功
                    this.loginFlag = 'success';
                }
                else if(json.type === 'inconsistent'){
                    //验证码不一致
                    this.loginFlag = 'inconsistent'
                }
                else {
                    // 账号密码错误
                    this.loginFlag = "NotFind"
                }

            } catch (error) {
                throw new Error('请求错误:' + error);
            }
        },

        //后端密码修改
        async revisesql(nickname: string , password: string , enablepassword: string){
            try {
                // 构造修改密码对象
                const information = {
                    nickname: nickname,
                    password: password,
                    enablepassword: enablepassword,
                }
                const response = await fetch('http://localhost:8080/api/revise', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(information)
                });

                const data: string = await response.text();
                const receiveData = JSON.parse(data)
                if (receiveData.type === 'success') {
                    this.userID = receiveData.userId
                    this.nickname = receiveData.nickname
                    this.password = receiveData.password
                    // 修改成功
                    return 'success'
                }
                else if (receiveData.type === 'failure') {
                    return 'failure'
                }
                else if (receiveData.type === 'error'){
                    return 'error'
                }
            } catch (error) {
                throw new Error('请求错误:' + error);
            }
        },



    }
})