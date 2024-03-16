<template>
    <!--注册-->
  <div class="sign">
      <div class="container">
          <el-row class="layout">
              <el-col class="col" :span="15">
                  <!--效果图-->
                  <div class="product-show">
                      <img src="@/assets/image/theme/login/Product-Demo-Photo.png" alt="">
                  </div>
              </el-col>
              <el-col :span="9">
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
                      <div class="form">
                          <!--返回-->
                          <div class="return">
                              <el-link class="return-last" :underline="false" @click="returnLogin">返回</el-link>
                          </div>
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
                              />
                          </div>
                          <!--密码-->
                          <div class="password">
                              <el-input
                                  placeholder="请输入密码"
                                  v-model="password"
                                  show-password
                                  style="width: 223px;"
                              ></el-input>
                          </div>
                          <div class="password1">
                              <el-input
                                  placeholder="请确认密码"
                                  v-model="enablepassword"
                                  show-password
                                  style="width: 223px;"
                              ></el-input>
                          </div>

                          <!--注册-->
                          <div class="submit">
                              <el-button color="#446DFF" type="primary" @click="submitCreate" >注册</el-button>
                          </div>

                          <!--脚页-->
                          <div class="footer">
                              <div>© 2024LPCCode.cn</div>
                              <div>Cookie与隐私</div>
                              <div>使用条款</div>
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
const enablepassword = ref('')

const router = useRouter()
const userStore = useUser()

const register = loginRegister()
//通知库组件
import {ElNotification} from 'element-plus'

//返回登陆界面
const returnLogin = () => {
    router.push({
        path:'/'
    });
}
const submitCreate = () => {
    if ((nickname.value&&password.value&&enablepassword.value)&&(password.value==enablepassword.value)) {
        register.loginexam(nickname.value , password.value)
        // 创建连接
        userStore.createWebSocket(nickname.value).then(async (res: any) => {
            if (res) {
                ElNotification({
                    title: '注册成功',
                    message: '欢迎 ' + nickname.value + ' 回家~',
                    type: 'success',
                })
                await router.push({
                    name: 'home'
                })
                return
            } else {
                ElNotification({
                    title: 'Warning',
                    message: '注册失败，请重新尝试',
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
    } else {
        ElNotification({
            title: 'Warning',
            message: '请确认输入信息是否正确',
            type: 'warning',
        })
    }
}


</script>

<style lang="scss" scoped>
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
    .form-container {
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

        .form {
            position: relative;
            display: flex;
            width: 400px;
            height: 400px;
            background: rgba(225, 225, 225, .7);
            margin-top: 30px;
            align-items: center;
            border-radius: 20px;
            flex-direction: column;
            justify-content: center;
            backdrop-filter: blur(3px);

            .return{
                position: absolute;
            }
            .return-last{
                margin-bottom: 330px;
                margin-right: 320px;
            }



            //    头像
            .avatar{
                position:relative;
                width: 84px;
                height: 84px;
                margin-bottom: 16px;

                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

            //    账号/昵称
            .nickname{
                margin-bottom: 12px;

                :deep(.el-input__inner){
                    color: #000;
                    font-weight: 600;
                    font-family: "Alimama DongFangDaKai" , serif;
                }
            }

            //密码
            .password{
                margin-bottom: 12px;
                :deep(.el-input__inner){
                    color: #000;
                    font-weight: 600;
                    font-family: "Alimama DongFangDaKai" , serif;
                }
            }
            //确认密码
            .password1{
                margin-bottom: 18px;
                :deep(.el-input__inner){
                    color: #000;
                    font-weight: 600;
                    font-family: "Alimama DongFangDaKai" , serif;
                }
            }

            //注册
            .submit{
                z-index: 2;
                margin-bottom: 50px;
                button{
                    width: 223px;
                }
                font-family: "Alimama DongFangDaKai", serif;

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

    }
}
//注册
.sign{
    display: flex;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background: #ECEFFF;
}

</style>