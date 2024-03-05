import {defineStore} from "pinia";

export const loginRegister =defineStore("login-register",{
    state:() =>({
        // 账号昵称
        nickname: '',
        //密码
        password: '',
        //账号密码信息
        accountInfo: [] as any,//登录者账号密码信息

    }),
    getters: {},
    actions:{
        //注册
        //存储到localStorage
         async register(nickname: string , password: string){
            //设置账号密码
            this.nickname = nickname
            this.password = password

             // 创建新的账号密码对象
             let account = {
                 nickname: this.nickname,
                 password: this.password,
             }

             // 清空 localStorage 中的账号信息
             // localStorage.removeItem('accountInfo');


             // 从 localStorage 中获取已存储的账号信息
             const storedAccountInfo = localStorage.getItem('accountInfo');
             const existingAccounts = storedAccountInfo ? JSON.parse(storedAccountInfo) : [];

             // 检查是否已存在相同昵称的账号
             const isDuplicate = existingAccounts.some((existingAccount: any) => existingAccount.nickname === account.nickname);

             if (!isDuplicate) {
                 // 不存在相同昵称的账号，将新的账号密码对象添加到已有的账号信息中
                 existingAccounts.push(account);

                 // 更新 localStorage 中的账号信息
                 localStorage.setItem('accountInfo', JSON.stringify(existingAccounts));

             } else {
                 // 存在相同昵称的账号，可以选择进行处理，例如给出提示
                 console.log('账号已存在，请使用其他昵称');
             }

             //测试使用
             console.log(existingAccounts);


        },
        //注册账号密码并存储到数据库
        async loginexam(nickname: string , password: string){
            const data = {
                nickname: nickname,
                password: password,
            }
            fetch('http://localhost:8080/api/sign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.ok) {
                        // 请求成功
                        console.log('注册成功');
                    } else {
                        // 请求失败
                        console.log('注册失败');
                    }
                })
                .catch(error => {
                    console.error('发生错误:', error);
                })
        },


        //登陆验证
        async login(nickname: string , password: string){
            // 从 localStorage 中获取已存储的账号信息
            const storedAccountInfo1 = localStorage.getItem('accountInfo');
            const existingAccounts1 = storedAccountInfo1 ? JSON.parse(storedAccountInfo1) : [];
            //测试使用
            console.log(existingAccounts1);

            // 检查是否已存在相同昵称的账号
            const isDuplicate1 = existingAccounts1.some((existingAccount1: any) => existingAccount1.nickname === nickname && existingAccount1.password ===password);

            if(isDuplicate1){
                return true
            }
            else{
                return false
            }
        },

        //后端密码登陆验证
        async loginsql(nickname: string , password:string){
            try {
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nickname, password })
                });

                const data: string = await response.text();
                if (data === 'login success') {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                throw new Error('请求错误:' + error);
            }
        },

        //后端密码修改
        async revisesql(nickname: string , password: string , enablepassword: string){
            try {
                const response = await fetch('http://localhost:8080/api/revise', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nickname, password , enablepassword})
                });

                const data: string = await response.text();
                if (data === 'revise success') {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                throw new Error('请求错误:' + error);
            }
        },

        //修改密码
        async revise(nickname: string ,password1: string ,password2: string){
            // 从 localStorage 中获取已存储的账号信息
            const storedAccountInfo = localStorage.getItem('accountInfo');
            const existingAccounts = storedAccountInfo ? JSON.parse(storedAccountInfo) : [];

            const isDuplicate2 = existingAccounts.some((existingAccount: any) => existingAccount.nickname === nickname && existingAccount.password ===password1);
            if(isDuplicate2){
                // 找到符合条件的账号，进行密码修改
                existingAccounts.forEach((existingAccount: any) => {
                    if (existingAccount.nickname === nickname) {
                        // 修改密码
                        existingAccount.password = password2;
                    }
                });
                // 将修改后的账号信息存回 localStorage
                localStorage.setItem('accountInfo', JSON.stringify(existingAccounts));
                return true
            }else {
                return false
            }

        }


    }
})