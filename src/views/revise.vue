<template>
  <!--注册-->
    <div class="revise">
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
                            <div v-if="isValid == 'legality'" style="margin-right: 120px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: green">账号格式正确</div>
                            <div v-else-if="isValid == 'Unlawful'" style="margin-right: 55px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: red">账号必须6位(数字+字母)</div>
                            <div v-else style="margin-right: 120px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: #646cff;">账号不能为空</div>
                            <!--密码-->
                            <div class="password">
                                <el-input
                                        placeholder="请输入旧密码"
                                        v-model="password"
                                        show-password
                                        style="width: 223px;"
                                ></el-input>
                            </div>
                            <div v-if="passwordValid =='legality'" style="margin-right: 120px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: green">密码格式正确</div>
                            <div v-else-if="passwordValid =='Unlawful'" style="margin-right: 50px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: red">密码必须10位(数字+字母)</div>
                            <div v-if="passwordValid =='null'" style="margin-right: 120px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: #646cff">密码不能为空</div>
                            <div class="password1">
                                <el-input
                                        placeholder="请输入新密码"
                                        v-model="enablepassword"
                                        show-password
                                        style="width: 223px;"
                                ></el-input>
                            </div>

                            <div v-if="passwordIssame =='same'" style="margin-right: 120px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: red">新旧密码相同</div>
                            <div v-else-if="passwordIssame =='Unlawful'" style="margin-right: 50px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: red">密码必须10位(数字+字母)</div>
                            <div v-else-if="passwordIssame =='NotSame'" style="margin-right: 120px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: green">密码格式正确</div>
                            <div v-else style="margin-right: 90px;font-family: 'Alimama DongFangDaKai' , serif;font-size: 14px;color: #646cff">确认密码不能为空</div>

                            <!--确定-->
                            <div class="submit">
                                <el-button color="#446DFF" type="primary" @click="onSuccess" >确定</el-button>
                            </div>

                            <Vcode :show="isShow" @success="submitCreate" @close="onClose" @fail="onFail"></Vcode>

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
import {ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useUser} from "../store/user.ts";
import {Avatar} from "@element-plus/icons-vue";

const nickname = ref('')
const password = ref('')
const enablepassword = ref('')

const router = useRouter()
const userStore = useUser()
//通知库组件
import {ElNotification} from 'element-plus'
import {loginRegister} from "../store/login-register.ts";

const revise = loginRegister()
//返回登陆界面
const returnLogin = () => {
    router.push({
        path:'/'
    });
}
const submitCreate = async () => {
    const flag = await revise.revisesql(nickname.value, password.value, enablepassword.value)
    if(flag === 'success'){
        if(await userStore.createWebSocket(nickname.value)){
            ElNotification({
                title: '成功',
                message: '欢迎'+nickname.value+'回家！！',
                type: 'success',
            })
            // 跳转到主页
            await router.push({
                name: 'home'
            })
        }
        else {
            ElNotification({
                title: '错误',
                message: '创建连接失败！！！',
                type: 'error',
            })
        }
    }
    else if (flag === 'failure'){
        ElNotification({
            title: '温馨提示',
            message: '修改失败，请重新尝试！！',
            type: 'warning',
        })
    }
    else {
        ElNotification({
            title: '温馨提示',
            message: '出现错误，请重新尝试！！',
            type: 'error',
        })
    }
}

import Vcode from "vue3-puzzle-vcode";
const isShow = ref(false)
const onSuccess = () => {
    if(isValid.value == 'legality' && passwordValid.value == 'legality' && passwordIssame.value == 'NotSame'){
        isShow.value = true
    }else {
        ElNotification({
            title: '温馨提示',
            message: '输入信息有误！！',
            type: 'warning',
        })
    }
}
// 验证失败
const onClose = () => {
    isShow.value = false
}
// 验证失败
// 自动刷新
const onFail = () => {

}

// 正则表达式
const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6}$/;
// 监听账号是否符合标准
const isValid = ref('empty')
watch(nickname, (newValue) => {
    checkAccount(newValue)
})
// 检测输入账号合法性
const checkAccount = (value) => {
    // 为空
    if(value === ''){
        isValid.value = 'empty'
    }
    // 合法
    if(regex.test(value)){
        isValid.value = 'legality'
    }
    // 不合法
    else {
        if(value != ''){
            isValid.value = 'Unlawful'
        }
    }
}


// 密码正则表达式
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{10}$/;
// 监听密码是否符合规则
const passwordValid = ref('null')
watch(password, (pwdValue) => {
    checkPassword(pwdValue)
})
//检测输入密码合法性
const checkPassword = (value) => {
    // 为空
    if(value === ''){
        passwordValid.value = 'null'
    }
    // 合法
    if(passwordRegex.test(value)){
        passwordValid.value = 'legality'
    }
    // 不合法
    else {
        if(value != ''){
            passwordValid.value = 'Unlawful'
        }
    }
}

// 确认密码是否与密码相同
const passwordIssame = ref('empty')
watch(enablepassword, (value) => {
    checkout(value)
})
const checkout = (value) => {
    console.log("输出的值为："+value)
    // 输入为空
    if(value == ''){
        passwordIssame.value = 'empty'
        console.log("标志为："+passwordIssame.value)
    }
    else {
        if(value === password.value){
            passwordIssame.value = 'same'
            console.log("标志为："+passwordIssame.value)
        }
        else {
            if(passwordRegex.test(enablepassword.value)){
                passwordIssame.value = 'NotSame'
                console.log("标志为："+passwordIssame.value)
            }else {
                // 不合法
                passwordIssame.value = 'Unlawful'
                console.log("标志为："+passwordIssame.value)

            }
        }
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
      }
      .nickname:deep(.el-input__inner){
          color: #000;
          font-weight: 600;
          font-family: "Alimama DongFangDaKai" , serif;
      }

        //密码
      .password{
      }
      .password:deep(.el-input__inner){
          color: #000;
          font-weight: 600;
          font-family: "Alimama DongFangDaKai" , serif;
      }
      //确认密码
      .password1{
      }
      .password1:deep(.el-input__inner){
          color: #000;
          font-weight: 600;
          font-family: "Alimama DongFangDaKai" , serif;
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
.revise{
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: #ECEFFF;
}

</style>