<template>
    <!--登录-->
    <div class="login">
    <!--容器-->
        <div class="container">
            <!--布局-->
            <el-row class="layout">
                <el-col class="col" :span="15">
                    <!--效果图-->
                    <div class="product-show">
                        <img src="@/assets/image/theme/login/Product-Demo-Photo.png" alt="">
                    </div>
                </el-col>
                <el-col :span="9">
                    <!--表单容器-->
                    <div class="form-container">
                        <!--LOGO-->
                        <div class="logo">
                            <!--图标-->
                          <div class="ico">
                              <img src="@/assets/image/theme/login/logo.png" alt="">
                          </div>
                            <!--标题-->
                          <div class="title">
                              即时通讯
                          </div>
                        </div>
                        <!--表单-->
                        <div class="form">
                            <!--头像-->
                            <div class="avatar">
                                <img src="@/assets/image/theme/login/avatar.png" alt="">
                            </div>
                            <!--账号昵称-->
                            <div class="nickname">
                                <el-input
                                    v-model="nickname"
                                    placeholder="请输入账号/昵称..."
                                    :prefix-icon="Avatar"
                                    @keyup.enter="submitCreate"
                                />
                            </div>

                            <!--密码-->
                            <div class="password">
                                <el-input
                                    placeholder="请输入密码"
                                    v-model="password"
                                    show-password
                                    style="width: 220px;"
                                    @keyup.enter="submitCreate"
                                ></el-input>
                            </div>


                            <!--提交-->
                            <div class="submit">
                                <el-button color="#446DFF" type="primary" @click="submitCreate">登录</el-button>
                            </div>

                            <!--注册账号-->
                            <div class="sign">
                                <el-link class="sign-up" :underline="false" @click="signup">注册账号</el-link>
                            </div>


                            <!--自动登录/忘记密码-->
                            <div class="automatic-login-forgot-password">
                               <!--自动登录-->
                               <div class="automatic-login">
                                   <el-checkbox v-model="automaticLoginCheckBox"  size="large">
                                       记住自动登录
                                   </el-checkbox>
                               </div>
                                <!--忘记密码-->
                                <div class="forgot-password">
                                    <el-link :underline="false" @click="revise">修改用户密码？</el-link>
                                </div>
                                <!--脚页-->
                                <div class="footer">
                                    <div>© 2024LPCCode.cn</div>
                                    <div>Cookie与隐私</div>
                                    <div>使用条款</div>

                                </div>
                            </div>
                        </div>

                    </div>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useRouter} from "vue-router";
import {useUser} from "../store/user.ts";
import {Avatar} from "@element-plus/icons-vue";

import {loginRegister} from "../store/login-register.ts";


const nickname = ref('')
const password = ref('')
const automaticLoginCheckBox = ref(false)

const router = useRouter()
const userStore = useUser()

const loginup =loginRegister()

//通知库组件
import {ElNotification} from 'element-plus'

/**
 * 修改密码跳转
 */
const revise = () => {
  router.push({
     name:'revise'
  });
}

/**
 * 注册账号跳转
 */
const signup = () => {
  router.push({
      name:'sign'
  });
}

/**
 * 提交创建登录
 */
const submitCreate = () => {
    if (nickname.value&&password.value) {
        //loginup.login(nickname.value ,password.value)
        console.log(loginup.loginsql(nickname.value , password.value))
        loginup.loginsql(nickname.value ,password.value).then((result) => {
            if(result){
                userStore.createWebSocket(nickname.value).then(async (res: any) => {
                    if (res) {
                        ElNotification({
                            title: '登录成功',
                            message: '欢迎 ' + nickname.value + ' 回家~',
                            type: 'success',
                        })
                        await router.push({
                            name: 'home'
                        })
                        return
                    }
                    else{
                        ElNotification({
                            title: 'Warning',
                            message: '登录失败，请重新尝试',
                            type: 'warning',
                        })
                    }
                }).catch(async (error: any) => {
                    ElNotification({
                        title: 'Error',
                        message: error,
                        type: 'error',
                    })
                })

            }
            else{
                ElNotification({
                    title: '温馨提示',
                    message: '请输入正确用户账号或密码',
                    type: 'warning',
                })
            }
        }).catch(async (error: any) => {
            ElNotification({
                title:'Error',
                message:error,
                type:error,
            })
        })
        // 创建连接
    //     userStore.createWebSocket(nickname.value).then(async (res: any) => {
    //         if (res) {
    //             ElNotification({
    //                 title: '登录成功',
    //                 message: '欢迎 ' + nickname.value + ' 回家~',
    //                 type: 'success',
    //             })
    //             await router.push({
    //                 name: 'home'
    //             })
    //             return
    //         } else {
    //             ElNotification({
    //                 title: 'Warning',
    //                 message: '登录失败，请重新尝试',
    //                 type: 'warning',
    //             })
    //         }
    //     }).catch(async (error: any) => {
    //         ElNotification({
    //             title: 'Error',
    //             message: error,
    //             type: 'error',
    //         })
    //     })
    // } else {
    //     ElNotification({
    //         title: 'Warning',
    //         message: '请输入正确用户账号或密码',
    //         type: 'warning',
    //     })
    }
    else{
        ElNotification({
            title:'温馨提示',
            message:'账号密码不能为空！',
            type:"warning",
        })
    }
}


//账号密码存储至数据库
// 构造要发送的数据对象


// 发送 POST 请求到后端接口
</script>

<style lang="scss" scoped>

//容器
.container{
    display: flex;
    width: 100%;
    //布局
    .layout{
        width: 100%;

        .col{
            display: flex;
            align-items: center;
            justify-content: center;
        }

    }

    //效果图
    .product-show{
        width: 869px;
        height: 547px;
        img{
            width: 100%;
            height: 100%;
        }
    }

    //表单容器
    .form-container{
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;

    //    logo
        .logo{
            display: flex;
            align-items: center;
        //    图标
            .ico{
                width: 48px;
                height: 48px;

                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }

    //    标题
        .title{
            color: #000;
            font-size: 32px;
            font-family: "Alimama ShuHeiTi Bold" , serif;
        }

    //    表单
        .form{
            position: relative;
            display: flex;
            width: 400px;
            height: 400px;
            background: rgba(225,225,225, .7);
            margin-top: 30px;
            align-items: center;
            border-radius: 20px;
            flex-direction: column;
            justify-content: center;
            backdrop-filter: blur(3px);

        //    头像
            .avatar{
                width: 84px;
                height: 84px;
                cursor: pointer;
                margin-bottom: 20px;


                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

        //    账号/昵称
            .nickname{
                margin-bottom: 10px;

                :deep(.el-input__inner){
                    color: #000;
                    font-weight: 600;
                    font-family: "Alimama DongFangDaKai" , serif;
                }
            }

            //密码
            .password{
                margin-bottom: 10px;
                :deep(.el-input__inner){
                    color: #000;
                    font-weight: 600;
                    font-family: "Alimama DongFangDaKai" , serif;
                }
            }



            //提交
            .submit{
                margin-bottom: 15px;
                button{
                    width: 223px;
                }
                font-family: "Alimama DongFangDaKai", serif;
            }


        //    自动登录/忘记密码
            .automatic-login-forgot-password{
                display: flex;
                width: 80%;
                align-items: center;
                margin-bottom: 20px;
                justify-content: space-between;
            }


        //    自动登录
            .automatic-login{
                :deep(.el-checkbox){
                    --el-checkbox-border-radius: 8px;
                }
                :deep(.el-checkbox__label){
                    font-size: 12px;
                    color: rgba(37,38,43, .6);
                }
            }


        //    忘记密码
            .forgot-password{
                :deep(.el-link__inner){
                    font-size: 12px;
                    color: rgba(37,38,43, .6);
                }
                :deep(.el-link__inner:hover){
                    color: #409eff;
                }
            }

        //    注册账号
            .sign{

                :deep(.el-link__inner){
                    font-size: 12px;
                    color: rgba(37,38,43, .6);

                }
                :deep(.el-link__inner:hover){
                    color: #409eff;
                }
                
            }

        }
    }

    //脚页
    .footer{
        position: absolute;
        display: flex;
        width: 80%;
        color: rgba(37,38,43, .8);
        font-size: 12px;
        bottom: 6px;
        align-items: center;
        justify-content: space-between;
    }
}

//登录
.login{
    display: flex;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background: #ecefff;

}

</style>