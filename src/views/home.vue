<template>
    <!--主页-->
    <div class="home">
        <!--容器-->
        <div class="container">
            <!--布局-->
            <el-row class="layout">
                <el-col :span="2">
                    <!--选项-->
                    <div class="grid-content options" :style="{backgroundColor: savedColorleft}">
                        <!--网络-->
                        <div v-if="isOnline" class="network">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div v-else class="network-offline">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <!--头像-->
                        <div class="avatar">
                            <img src="@/assets/image/theme/login/avatar.png" alt="">
                            <div class="online-state"></div>
                            <div class="nickname">{{ nickname }}</div>
                        </div>
                        <!--功能-->
                        <div class="feature">
                            <!--选项-->
                            <div class="option">
                                <el-icon>
                                    <Comment/>
                                </el-icon>
                            </div>
                            <div class="option">
                                <el-icon>
                                    <Avatar/>
                                </el-icon>
                            </div>
                            <div class="option">
                                <el-icon>
                                    <WalletFilled/>
                                </el-icon>
                            </div>
                            <div class="settings">
                                <el-icon @click="toggleSettingsDialog">
                                    <Tools/>
                                </el-icon>
                            </div>

                            <!-- 设置对话框 -->
<!--                            <el-dialog-->
<!--                                :visible="settingsDialogVisible"-->
<!--                                @update:visible="settingsDialogVisible = $event"-->
<!--                                title="修改主题"-->
<!--                                width="30%">-->

<!--                                <el-color-picker v-model="selectedColor" show-alpha></el-color-picker>-->
<!--                                <el-button type="primary" @click="saveAndCloseSettingsDialog">保存</el-button>-->
<!--                            </el-dialog>-->

                            <el-dialog
                                destroy-on-close
                                v-model="dialogVisible"
                                title="选择你喜欢的主题"
                                width="25%"
                                center
                                align-center
                            >
                                <div class="option-color">
                                    <el-radio-group v-model="selectedOption" size="large" class="el-radio-group--medium">
                                        <el-radio :label="1">原色</el-radio>
                                        <el-radio :label="2">暖色</el-radio>
                                        <el-radio :label="3">暗色</el-radio>
                                    </el-radio-group>
                                </div>

                                <div class="dialogbottom">
                                    <el-button class="exit" type="success" @click="dialogexit">退出</el-button>
                                    <el-button class="save" type="success" @click="dialogsave">保存</el-button>
                                </div>
                            </el-dialog>

                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <!--好友-->
                    <div class="grid-content friends" :style="{backgroundColor: savedColorfriendlist}">
                        <!--导航-->
                        <div class="navigation" :style="{backgroundColor: savedColornavi}">
                            <!--搜索-->
                            <div class="search">
                                <el-input @keyup.enter="searchfriend" v-model="search" placeholder="请输入昵称！！！" :prefix-icon="Search" size="small"/>
                            </div>

                            <!--弹出框显示好友信息-->
                            <el-dialog
                                :before-close="closeTest"
                                destroy-on-close
                                width="50%"
                                v-model="searchvisible"
                                align-center
                                center
                            >
                                你们好！！！！
                            </el-dialog>


                            <!--创建群聊-->
                            <div class="add">
                                <el-icon @click="creatIt">
                                    <CirclePlusFilled/>
                                </el-icon>
                            </div>


                        </div>

<!--                        **************-->
                        <!--创建群聊界面-->
                        <el-dialog
                            destroy-on-close
                            :before-close="closeTest"
                            v-model="creatGroup"
                            width="50%"
                            align-center
                            center
                            :show-close="true"
                            title="创建群聊"

                        >
                            <div class="information">
                                <el-form-item label="群名：" style="font-size: 20px">
                                    <el-input
                                        placeholder="请输入群名！！"
                                        v-model="inputGroupName"
                                        clearable>
                                    </el-input>
                                </el-form-item>

                                <!--全选好友-->
                                <el-checkbox
                                    v-model="checkAll"
                                    @change="handleCheckAllChange"
                                    class="check-all"
                                >
                                    全选
                                </el-checkbox>
                            </div>
                            <div class="createGroup" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll" >
                                <div class="find-friends" v-for="(friend,index) in friendsListInfo" :key="index" >
                                    <!--头像-->
                                    <div class="friend-avatar">
                                        <img src="@/assets/image/theme/login/other.png" alt="">
                                    </div>

                                    <!--好友消息-->
                                    <div class="friend-message">
                                        <!--昵称-->
                                        <div class="friend-nickname">

                                            <div class="nickname">昵称： {{ friend.nickname }}</div>

                                        </div>
                                        <!--最新通知-->
                                        <div class="friend-latest-notice">
                                            大家好！我是{{friend.nickname}}
                                            <img src="">
                                        </div>
                                        <div class="friend-badge">
                                            <!--多选框-->
                                                <el-checkbox
                                                    v-model="checksingle"
                                                    @change="handleFriendSelectionChange(friend.nickname )"
                                                >
                                                    {{index+1}}
                                                </el-checkbox>
                                        </div>

                                    </div>

                                </div>

                            </div>
                            <div class="operate">
                                <el-button type="success" @click="exitgroup">退出</el-button>
                                <el-button type="success" @click="create">创建</el-button>
                            </div>
                        </el-dialog>
<!--                        ****************-->
                        <!--好友列表无限滚动-->
                        <div class="infinite-scroll" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll">
                            <!--好友-->
<!--                           @click="friendsInfo=friend" -->
<!--                             v-for="(friend,index) in friendsListInfo" :key="index"-->
                            <div class="friend" @click="handleClick('private',friend)" v-for="(friend,index) in friendsListInfo" :key="index">
                                <!--头像-->
                                <div class="avatar">
                                    <img src="@/assets/image/theme/login/other.png" alt="">
                                </div>
                                <!--好友消息-->
                                <div class="message">
                                    <!--昵称-->
                                    <div class="nickname">
<!--                                        {{ friend.nickname }}-->
                                        <div>{{ friend.nickname }}</div>
<!--                                        {{ friend.messages.length }}-->
                                        <div class="badge">
                                            {{ friend.messages.length }}
                                        </div>
                                    </div>
                                    <!--最新通知-->
<!--                                    {{ friend.latestNews }}-->
                                    <div class="latest-notice">
                                        {{ friend.latestNews }}
                                        <img src="">
                                    </div>

                                </div>
                            </div>

<!--                            ***************************-->
                            <!--群聊-->
                            <div class="group"  @click="handleClick('public',group)" v-for="(group,index) in groupListInfo" :key="index">
                                <!--头像-->
                                <div class="group-avatar">
                                    <img src="@/assets/image/theme/login/other.png" alt="">
                                </div>
                                <!--好友消息-->
                                <div class="group-message">
                                    <!--昵称-->
                                    <div class="group-nickname">
                                        <div>{{group.groupnickname}}</div>
                                        <div class="group-badge">
                                            {{group.messages.length}}
                                        </div>
                                    </div>
                                    <!--最新通知-->
                                    <div class="group-latest-notice">
                                        {{group.latestNews}}
                                    </div>

                                </div>
                            </div>
<!--                            ****************************-->



                        </div>
                    </div>
                </el-col>
                <el-col class="private" v-if="flag" :span="16">
                    <!--聊天-->
                    <div class="grid-content chats" :style="{backgroundColor: savedColorchats}">

                        <!--顶部-->
                        <div class="top" :style="{ backgroundColor: savedColortop }">
                            <!--昵称-->
                            <div class="nickname">{{ friendsInfo.nickname }}</div>
                            <!--在线状态-->
                            <div class="status">
                                <!--状态-->
                                <div class="state" :style="{background: friendsInfo.status ? '#77FD59' : '#A8ABB2'}"></div>
                                <!--在线/离线-->
                                <div class="online-and-offline">{{ friendsInfo.status ? '在线' : '离线' }}</div>
                            </div>
                        </div>

                        <!--私人聊天-->
                        <div class="chat">
                            <!--无限滚动-->
                            <div class="infinite-scroll" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll">
                                <div v-for="(message,index) in friendsInfo.messages" :key="index">
                                    <!--左边-->
                                    <div class="left" v-if="message.type === 'friend'">
                                        <!--头像-->
                                        <div class="avatar">
                                            <img src="@/assets/image/theme/login/other.png" alt="">
                                        </div>

                                        <!--文本消息-->
                                        <div class="message" v-if="message.sort === 'text'">
                                            {{ message.message }}
                                            <!--三角形-->
                                            <div class="triangle"></div>
                                        </div>

                                        <!--图片消息-->
                                        <div class="image-message" v-else-if="message.sort === 'image'">
                                            <img  v-if="message.message !== ''" :src="message.message" alt="Uploaded Image" style="max-width: 120px; max-height: 120px;" @click="openleftDialog(message.message)">
                                            <!--三角形-->
                                            <div class="image-triangle"></div>
                                        </div>

                                        <!--文件类型-->
                                        <div class="upload" v-else>
                                            <div class="load-top">
                                                <div class="photo">
                                                    <img src="@/assets/image/theme/home/svg/img.png" alt="">
                                                </div>
                                                <div class="top-right">
                                                    <div class="docname">实验五.pdf</div>
                                                    <!--大小-->
                                                    <div class="size">23.5KB</div>
                                                </div>
                                            </div>
                                            <div class="line"></div>
                                            <div class="load-bottom">
                                                <div class="open">打开</div>
                                                <div class="copy">复制</div>
                                                <el-link class="dload" @click="download(message.message)">下载</el-link>
                                            </div>
                                            <!--三角形-->
                                            <div class="file-triangle"></div>
                                        </div>


                                        <!--预览图片-->

                                    </div>
                                    <!--右边-->
                                    <div class="right" v-else>
                                        <!--文本消息-->
                                        <div class="message" v-if="message.sort === 'text'">
                                            {{ message.message }}
<!--                                            <img v-if="message.message !== ''" :src="message.message" alt="Uploaded Image" style="max-width: 40px; max-height: 30px;">-->
                                            <!--三角形-->
                                            <div class="triangle"></div>
                                        </div>

                                        <!--图片消息-->
                                        <div class="image-message" v-else-if="message.sort === 'image'">
                                            <img v-if="message.message !== ''" :src="message.message" alt="Uploaded Image" style="max-width: 120px; max-height: 120px;" @click="openDialog(message.message)">

                                            <!--三角形-->
                                            <div class="image-triangle"></div>
                                        </div>

                                        <!--文件类型-->
                                        <div class="upload" v-else>
                                            <div class="load-top">
                                                <div class="photo">
                                                    <img src="@/assets/image/theme/home/svg/img.png" alt="">
                                                </div>
                                                <div class="top-right">
                                                    <div class="docname">实验五.pdf</div>
                                                    <!--大小-->
                                                    <div class="size">23.5KB</div>
                                                </div>
                                            </div>
                                            <div class="line"></div>
                                            <div class="load-bottom">
                                                <div class="open">打开</div>
                                                <div class="copy">复制</div>
                                                <el-link class="dload" @click="download(message.message)">下载</el-link>
                                            </div>
                                            <!--三角形-->
                                            <div class="file-triangle"></div>
                                        </div>

                                        <!--头像-->
                                        <div class="avatar">
                                            <img src="@/assets/image/theme/login/avatar.png" alt="">
                                        </div>
                                    </div>
                                </div>

                                <!--左侧图片预览-->
                                <el-dialog
                                    :before-close="closeTest"
                                    destroy-on-close
                                    v-model="dialogVisibleImageleft"
                                    title="图片预览"
                                    width="50%"
                                    align-center
                                    center
                                >
                                    <el-image style="width: auto; height: auto"
                                              :src="imagDialogleft" :fit="'cover'"
                                    />
                                </el-dialog>

                                <!--右侧预览图片-->
                                <el-dialog
                                    :before-close="closeTest"
                                    destroy-on-close
                                    v-model="dialogVisibleImage"
                                    title="图片预览"
                                    width="50%"
                                    align-center
                                    center
                                >
                                    <el-image style="width: auto; height: auto"
                                              :src="imgDialog" :fit="'cover'"
                                    />
                                </el-dialog>
                            </div>
                        </div>

                        <!--底部-->
                        <div class="bottom" :style="{backgroundColor: savedColorbottom}">
                            <!--左边-->
                            <div class="left">
                                <!--表情包-->
<!--                                <div class="emoji">-->
<!--                                    <img src="@/assets/image/theme/home/svg/smile.svg" alt="">-->
<!--                                </div>-->
                                <el-form class="emoji" >
                                    <el-form-item>
                                        <ElIconPicker v-model="icon" @select-icon="handleSelectIcon">></ElIconPicker>
                                    </el-form-item>
                                </el-form>

                                <!--图片-->
                                <div class="picture">
                                    <el-icon @click="openFilePicker">
                                        <Picture />
                                    </el-icon>
                                </div>

                                <!--文件-->
                                <div class="file">
                                    <el-icon @click="openFilePickerfile">
                                        <FolderOpened/>
                                    </el-icon>
                                </div>
                            </div>
                            <!--输入框-->
                            <div class="middle">
                                <el-input @keyup.enter="sendMessages" v-model="message" placeholder="现在可以开始聊天了。"/>
                            </div>

                            <!--发送-->
                            <div class="right" @click="sendMessages">
                                <el-icon>
                                    <Promotion/>
                                </el-icon>
                            </div>

                        </div>
                    </div>
                </el-col>
                <el-col class="public" v-else :span="16">
                    <!--多人聊天-->
                    <div class="grid-content chats" :style="{backgroundColor: savedColorchats}">
                        <!--群聊顶部-->
                        <div class="group-top" :style="{backgroundColor: savedColortop}">
                            <!--昵称-->
                            <div class="group-nickname">{{currentGroupInfo.groupnickname}}</div>
                            <!--在线状态-->
                            <div class="status1">
                                <!--状态-->
                                <div class="state1"></div>
                                <!--群聊人数-->
                                <div class="group-number">{{friendsListInfo.length+1}}人</div>
                            </div>
                        </div>

                        <!--群聊-->
                        <div class="group-chat">
                            <!--无限滚动-->
                            <div class="infinite-scroll" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll">
                                <div v-for="(groupmessage,index) in currentGroupInfo.messages" :key="index">
                                    <!--左边-->
                                    <div class="left" v-if="groupmessage.type === 'group-friend'">
                                        <!--头像-->
                                        <div class="avatar">
                                            <img src="@/assets/image/theme/login/other.png" alt="">
                                        </div>

                                        <div class="groupmessage">
                                            {{groupmessage.groupmessage}}
                                            <!--三角形-->
                                            <div class="triangle"></div>
                                        </div>
                                    </div>
                                    <!--右边-->
                                    <div class="right" v-else-if="groupmessage.type ==='group-my'">
                                        <!--消息-->
                                        <div class="groupmessage">
                                            {{groupmessage.groupmessage}}
                                            <!--三角形-->
                                            <div class="triangle"></div>
                                        </div>
                                        <!--头像-->
                                        <div class="avatar">
                                            <img src="@/assets/image/theme/login/avatar.png" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--群聊底部-->
                        <div class="bottom" :style="{backgroundColor: savedColorbottom}">
                            <!--左边-->
                            <div class="left">

                                <!--表情包-->
<!--                                <div class="emoji">-->
<!--                                    <img src="@/assets/image/theme/home/svg/smile.svg" alt="">-->
<!--                                </div>-->
                                <el-form class="emoji" >
                                    <el-form-item>
                                        <ElIconPicker v-model="icon" @select-icon="grouphandleSelectIcon">></ElIconPicker>
                                    </el-form-item>
                                </el-form>

                                <div class="picture">
                                    <el-icon @click="opengroupFilePicker">
                                        <Picture />
                                    </el-icon>
                                </div>

                                <!--文件-->
                                <div class="file">
                                    <el-icon>
                                        <FolderOpened/>
                                    </el-icon>
                                </div>
                            </div>
                            <!--输入框-->
                            <div class="middle">
                                <el-input @keyup.enter="sendGroupMessages" v-model="groupmessage" placeholder="现在我们可以开始聊天了。"/>
                            </div>

                            <!--发送-->
                            <div class="right" @click="sendGroupMessages">
                                <el-icon>
                                    <Promotion/>
                                </el-icon>
                            </div>
                        </div>

                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref, reactive, toRefs} from 'vue'
import {useNetwork} from '@vueuse/core'

import {
    Promotion,
    FolderOpened,
    CirclePlusFilled,
    Search,
    WalletFilled,
    Avatar,
    Comment,
    Tools
} from '@element-plus/icons-vue'

import {useUser} from '../store/user';

const userStore = useUser()
import {storeToRefs} from 'pinia'



//单人聊天选择图片
const openFilePicker = () => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
                const file = target.files?.[0];
                if (file) {
                    await userStore.picUpload(file)
                    await userStore.sendMessagesImage(userStore.imageUrl1)
                    resolve(file);
                } else {
                    reject('未选择文件');
                }
            } else {
                reject('无效的目标');
            }
        };
        input.click();
    });
};

//单人聊天选择文件
const openFilePickerfile = () => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.doc, .docx, .md, .rar, .zip';
        input.onchange = async (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
                const file = target.files?.[0];
                if (file) {
                    // 调用 picUpload 函数上传文件
                    await userStore.picUploadfile(file)
                    await userStore.sendMessagesFile(userStore.fileUrl)
                    resolve(file);
                } else {
                    reject('未选择文件');
                }
            } else {
                reject('无效的目标');
            }
        };
        input.click();
    });
};


//单人聊天选择图片
const opengroupFilePicker = () => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
                const file = target.files?.[0];
                if (file) {
                    await userStore.picUpload(file)
                    resolve(file);
                } else {
                    reject('未选择文件');
                }
            } else {
                reject('无效的目标');
            }
        };
        input.click();
    });
};

//单人聊天选择文件
const opengroupFilePickerfile = () => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.doc, .docx, .md, .rar, .zip';
        input.onchange = async (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
                const file = target.files?.[0];
                if (file) {
                    // 调用 picUpload 函数上传文件
                    await userStore.picUploadfile(file)
                    resolve(file);
                } else {
                    reject('未选择文件');
                }
            } else {
                reject('无效的目标');
            }
        };
        input.click();
    });
};

//主题颜色切换


//更改聊天顶部颜色
//保存点击按钮之后的颜色
let savedColortop = ref('')
const topcolors: Record<string, string> = {
    '1': '#F7FCFF',
    '2': '#edea7e',
    '3': '#535353'
}
//更改聊天页面颜色
let savedColorchats = ref('')
const chatscolors: Record<string, string> = {
    '1': '#EFF3F6',
    '2': '#fffc7f',
    '3': '#6c6c6c'
}
//更改聊天底部颜色
let savedColorbottom = ref('')
const bottomscolors: Record<string, string> = {
    '1': '#F7FCFF',
    '2': '#edea7e',
    '3': '#535353'
}
//更改好友列表颜色
let savedColorfriendlist = ref('')
const friendlistcolors: Record<string, string> = {
    '1': '#363F48',
    '2': '#bfbc55',
    '3': '#535353'
}
//更改导航颜色
let savedColornavi = ref('')
const navicolors: Record<string, string> = {
    '1': '#3A434A',
    '2': '#aeab4d',
    '3': '#474747'
}
//更改左侧边栏颜色
let savedColorleft = ref('')
const leftcolors: Record<string, string> = {
    '1': '#3A434A',
    '2': '#aeab4d',
    '3': '#474747'
}


const selectedOption = ref(1)
const dialogVisible = ref(false)
//弹出更改主题对话框
const toggleSettingsDialog = () => {
    dialogVisible.value = !dialogVisible.value
    console.log(dialogVisible.value)
}
//对话框退出按钮
const dialogexit = () =>{
    dialogVisible.value = false
}
//保存按钮回退主界面
const dialogsave = () =>{
    savedColortop.value = topcolors[selectedOption.value]
    savedColorchats.value = chatscolors[selectedOption.value]
    savedColorbottom.value = bottomscolors[selectedOption.value]
    savedColorfriendlist.value = friendlistcolors[selectedOption.value]
    savedColornavi.value = navicolors[selectedOption.value]
    savedColorleft.value = leftcolors[selectedOption.value]
    dialogVisible.value = false
}

//主题颜色切换结束

//表情包引入
import {emojiArr} from "../assets-others/emojidata.ts";
import ElIconPicker from "../components/el-icon-picker.vue";
const icon = ref('');
// 监听子组件 ElIconPicker 中选中表情的事件
const handleSelectIcon = (emoji: string) => {
    message.value += emoji; // 将选中的表情添加到输入框的值中
};
const grouphandleSelectIcon = (emoji: string) => {
    groupmessage.value += emoji; // 将选中的表情添加到输入框的值中
};

//


const {nickname, friendsInfo, friendsListInfo} = storeToRefs(userStore)

const network = reactive(useNetwork())
const {isOnline} = toRefs(network)
// console.log(isOnline.value)

const search = ref('')
const message = ref('')
const loadInfiniteScroll = () => {

}

//*****************
import {storemessage} from "../store/storemessage.ts";
import router from "../router";
import {ElNotification} from "element-plus";
const store = storemessage()
//****************
//调用user.ts里边的sendMessage方法，私聊发送
const sendMessages = async () => {
    if (message.value) {
        if (await userStore.sendMessages(message.value)) {
            message.value = ''

        }
    }
}

const flag = ref(true)
const handleClick = (type: string , item) => {
    if(type === 'private'){
        flag.value = true
        friendsInfo.value = item
    }
    else {
        flag.value = false
        currentGroupInfo.value = item
    }

}
const {groupnickname ,currentGroupInfo, groupListInfo} = storeToRefs(userStore)
const groupmessage = ref('')
//调用user.ts里的sendGroupMessage方法，群聊发送
const sendGroupMessages = async () => {
    if(groupmessage.value){
        if(await userStore.sendGroupMessages(groupmessage.value)){
            groupmessage.value = ''
        }
    }
}
//将群聊昵称传入后端

//
// const imageUrl1 = ref('')
// const picUpload = async (f) => {
//     let params = new FormData()
//     params.append("file", f);
//     const response = await fetch('http://localhost:8080/api/upload', {
//         method: 'POST',
//         body: params
//     })
//
//     const data: string = await response.text();
//     imageUrl1.value = data
//     console.log(imageUrl1.value)
//
// }
console.log(userStore.fileUrl)


//点击下载,下载文件
const download = (url: string) => {
    window.location.href = url
}

//点击图片打开预览
const imgDialog = ref('')
//控制对话框弹出
const dialogVisibleImage = ref(false)
const openDialog = (url: string) => {
    dialogVisibleImage.value = !dialogVisibleImage.value //打开弹框
    imgDialog.value = url; //点击时拿到的图片地址
}


//左侧对方预览图片
const imagDialogleft = ref('')
const dialogVisibleImageleft = ref(false)
const i = ref(0)
const openleftDialog = (url: string) =>{
    dialogVisibleImageleft.value = !dialogVisibleImageleft.value
    imagDialogleft.value = url
}

const  closeTest = (done) => {
    console.log(i.value++)
    done();
}


//搜索框显示个人信息
const searchvisible = ref(false)
const searchfriend = () => {
    searchvisible.value = !searchvisible.value
}

//创建群聊
const creatGroup = ref(false)

const creatIt = () => {
    creatGroup.value = !creatGroup.value
}



//创建群聊
//输入群聊名
const inputGroupName = ref('')
//退出界面
const exitgroup = () => {
    creatGroup.value = false
}

//创建群聊
const create = () =>{
    userStore.createGroupres(inputGroupName.value , selectedFriends.value).then((result) => {
        creatGroup.value = false
    }).catch(async (error: any) => {
        ElNotification({
            title:'Error',
            message:error,
            type:error,
        })
    })

}

//全选框
const checkAll = ref(false)

const checksingle = ref(false)

//存放选择好友的一个列表
const selectedFriends = ref([])
//全选状态改变
//check用来判断是否为 全选
const handleCheckAllChange = (check) => {
    // 遍历所有好友，更新其复选框状态
    if(check){
        checksingle.value = true
        selectedFriends.value = friendsListInfo.value
        selectedFriends.value.forEach(fri =>{
            console.log(fri.nickname)
        })
    }else{
        checksingle.value = false
        selectedFriends.value = []
    }

}
// 单个好友复选框状态改变
const handleFriendSelectionChange = (nickname: string) => {
    // 如果选中的好友列表中不包含该好友，则添加到选中好友列表中；否则从选中好友列表中移除
    if (selectedFriends.value.includes(nickname)) {
        selectedFriends.value = selectedFriends.value.filter(f => f !== nickname)
    } else {
        selectedFriends.value.push(nickname)
    }
}
</script>

<style lang="scss" scoped>


.createGroup {
    background: #f9f9f9;
    width: 100%;
    height: 530px;
    //border: 1px solid red;
    // 好友
    .find-friends {
        background: #ECEFFF;
        display: flex;
        height: 60px;
        cursor: pointer;
        align-items: center;
        justify-content: space-evenly;
        // 头像
        .friend-avatar {
            width: 38px;
            height: 38px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        // 好友消息
        .friend-message {
            position: relative;
            display: flex;
            align-items: center;
            // 昵称
            .friend-nickname {
                font-weight: bold;
                .nickname{
                    margin-right: 50px;
                    font-weight: bold;
                    font-family: "Alimama ShuHeiTi Bold" , serif;
                    color: #000000;
                }

            }
            .friend-badge {
                margin-left: 100px;
            }

            // 最新通知
            .friend-latest-notice {
                margin-left: 20px;
                width: 100px;
                color: #000000;
                font-weight: bold;
                font-size: 12px;
                font-family: "Alimama DongFangDaKai", serif;
                text-overflow: ellipsis; /* ellipsis:显示省略符号来代表被修剪的文本  string:使用给定的字符串来代表被修剪的文本*/
                white-space: nowrap; /* nowrap:规定段落中的文本不进行换行   */
                overflow: hidden; /*超出部分隐藏*/
            }
        }
    }

    // 好友鼠标悬浮
    .find-friends:hover {
        background: #A6B6C3;
    }

}

.information{
    display: flex;
    width: 100%;
    height: 40px;
    margin-bottom: 20px;

    .check-all{
        position: relative;
        margin-left: 100px;
    }

}

//选择
.option-color{
    display: flex;
    justify-content: space-around;
}

.dialogbottom{
    display: flex;
    justify-content: space-evenly;
}
// 布局
.layout {
    position: relative;
    width: 100%;
    height: 100%;

    .grid-content {
        height: 100%;
        background: #ecefff;
    }

    // 选项
    .options {
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        border-radius: 4px 0 0 4px;
        background: #303842;

        // 状态
        .network {
            display: flex;
            width: 100%;
            margin-top: 20px;
            margin-bottom: 30px;
            justify-content: space-evenly;

            div {
                width: 11px;
                height: 11px;
                border-radius: 50%;
            }

            div:nth-child(1) {
                background: red;
            }

            div:nth-child(2) {
                background: #FFF35A;
            }

            div:nth-child(3) {
                background: #77FD59;
            }
        }

        .network-offline {
            display: flex;
            width: 100%;
            margin-top: 20px;
            margin-bottom: 30px;
            justify-content: space-evenly;

            div {
                width: 11px;
                height: 11px;
                border-radius: 50%;
                background: red;
            }
        }

        // 头像
        .avatar {
            position: relative;
            width: 84px;
            height: 84px;
            margin-bottom: 35px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50px;
            }

            // 在线状态
            .online-state {
                position: absolute;
                width: 14px;
                height: 14px;
                right: 6px;
                bottom: 6px;
                background: #77FD59;
                border-radius: 50%;
            }

            // 用户昵称
            .nickname {
                color: #fff;
                font-size: 14px;
                font-family: "Alimama ShuHeiTi Bold", serif;
            }


        }

        // 功能
        .feature {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            flex-direction: column;
            // 选项
            .option {
                display: flex;
                height: 48px;
                font-size: 24px;
                color: #A6B6C3;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                border-left: 3px solid #303842;
            }

            .option:nth-child(1) {
                color: #fff;
                //原颜色为：#363F48
                background: #55D58B;
                border-left: 3px solid #77FD59;
            }

            // 选项鼠标悬浮
            .option:hover {
                color: #fff;
                background: #55D58B;
                border-left: 3px solid #77FD59;
            }

            // 设置
            .settings {
                position: absolute;
                width: 100%;
                display: flex;
                color: #A6B6C3;
                cursor: pointer;
                height: 38px;
                font-size: 24px;
                align-items: center;
                justify-content: center;
                bottom: 20px;
            }

            // 设置鼠标悬浮
            .settings:hover {
                color: #fff;
            }
        }
    }

    // 好友
    .friends {
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        background: #363F48;
        // 导航
        .navigation {
            display: flex;
            width: 100%;
            height: 40px;
            background: #3A434A;
            align-items: center;
            margin-bottom: 12px;
            justify-content: space-evenly;
            // 搜索
            .search {


                :deep(.el-input__inner) {
                    color: #fff;
                    font-weight: 600;
                    font-family: "Alimama DongFangDaKai", serif;
                }

                :deep(.el-input__wrapper) {
                    background: #303842;
                    border-radius: 50px;
                }

            }

            // 添加
            .add {
                display: flex;
                cursor: pointer;
                font-size: 24px;
                align-items: center;
                justify-content: center;
                color: #606266;
            }

            .add:hover {
                color: #ffffff;
            }
        }

        // 好友列表无限滚动
        .infinite-scroll {
            width: 100%;
            height: 530px;
            //border: 1px solid red;
            // 好友
            .friend {
                display: flex;
                height: 60px;
                cursor: pointer;
                align-items: center;
                justify-content: space-evenly;
                // 头像
                .avatar {
                    width: 38px;
                    height: 38px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                // 好友消息
                .message {
                    display: flex;
                    width: 210px;
                    text-align: left;
                    flex-direction: column;
                    // 昵称
                    .nickname {
                        display: flex;
                        color: #fff;
                        font-size: 12px;
                        font-family: "Alimama DongFangDaKai", serif;
                        justify-content: space-between;

                        .badge {
                            display: flex;
                            color: #ffffff;
                            width: 18px;
                            height: 18px;
                            font-size: 10px;
                            font-family: "Alimama ShuHeiTi Bold", serif;
                            background: red;
                            border-radius: 50%;
                            text-align: center;
                            align-items: center;
                            justify-content: center;
                        }
                    }

                    // 最新通知
                    .latest-notice {
                        width: 210px;
                        color: #C0C4CC;
                        font-size: 9px;
                        font-family: "Alimama DongFangDaKai", serif;
                        text-overflow: ellipsis; /* ellipsis:显示省略符号来代表被修剪的文本  string:使用给定的字符串来代表被修剪的文本*/
                        white-space: nowrap; /* nowrap:规定段落中的文本不进行换行   */
                        overflow: hidden; /*超出部分隐藏*/
                    }
                }
            }
            //*************************
            .group {
                display: flex;
                height: 60px;
                cursor: pointer;
                align-items: center;
                justify-content: space-evenly;
                // 头像
                .group-avatar {
                    width: 38px;
                    height: 38px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                // 好友消息
                .group-message {
                    display: flex;
                    width: 210px;
                    text-align: left;
                    flex-direction: column;
                    // 昵称
                    .group-nickname {
                        display: flex;
                        color: #fff;
                        font-size: 12px;
                        font-family: "Alimama DongFangDaKai", serif;
                        justify-content: space-between;

                        .group-badge {
                            display: flex;
                            color: #ffffff;
                            width: 18px;
                            height: 18px;
                            font-size: 10px;
                            font-family: "Alimama ShuHeiTi Bold", serif;
                            background: red;
                            border-radius: 50%;
                            text-align: center;
                            align-items: center;
                            justify-content: center;
                        }
                    }

                    // 最新通知
                    .group-latest-notice {
                        width: 210px;
                        color: #C0C4CC;
                        font-size: 9px;
                        font-family: "Alimama DongFangDaKai", serif;
                        text-overflow: ellipsis; /* ellipsis:显示省略符号来代表被修剪的文本  string:使用给定的字符串来代表被修剪的文本*/
                        white-space: nowrap; /* nowrap:规定段落中的文本不进行换行   */
                        overflow: hidden; /*超出部分隐藏*/
                    }
                }
            }
            //*************************

            // 好友鼠标悬浮
            .friend:hover {
                background: #444C56;
            }

            //群聊列表悬浮
            .group:hover{
                background: #444C56;
            }
        }
    }

    // 聊天
    .chats {
        //新加的
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        border-radius: 0 4px 4px 0;
        background: #EFF3F6;
        // 顶部
        .top {
            //层级
            display: flex;
            width: 100%;
            height: 48px;
            font-size: 14px;
            align-items: center;
            justify-content: center;
            background: #F7FCFF;
            border-radius: 0 4px 4px 0;
            // 昵称
            .nickname {
                color: #000;
                font-family: "Alimama ShuHeiTi Bold", serif;
            }

            // 状态
            .status {
                display: flex;
                align-items: center;
                justify-content: center;
                // 状态
                .state {
                    width: 10px;
                    height: 10px;
                    margin: 0 8px;
                    border-radius: 50px;
                }

                // 在线或离线
                .online-and-offline {
                    color: #606266;
                    font-size: 12px;
                    font-family: "Alimama DongFangDaKai", serif;
                }
            }
        }

        //****************************************
        .group-top {
            display: flex;
            width: 100%;
            height: 48px;
            font-size: 14px;
            align-items: center;
            justify-content: center;
            background: #F7FCFF;
            border-radius: 0 4px 4px 0;
            // 昵称
            .group-nickname {
                color: #000;
                font-family: "Alimama ShuHeiTi Bold", serif;
            }

            // 状态
            .status1 {
                display: flex;
                align-items: center;
                justify-content: center;
                // 状态
                .state1 {
                    background: #77FD59;
                    width: 10px;
                    height: 10px;
                    margin: 0 8px;
                    border-radius: 50px;
                }

                // 在线或离线
                .group-number {
                    color: #606266;
                    font-size: 12px;
                    font-family: "Alimama DongFangDaKai", serif;
                }
            }
        }

        //****************************************

        // 私人聊天
        .chat {
            display: flex;
            width: 100%;

            // 无限滚动
            .infinite-scroll {
                width: 100%;
                height: 484px;
            }

            // 左边
            .left {
                position: relative;
                display: flex;
                margin-top: 10px;
                align-items: center;
                padding-left: 6px;
                // 头像
                .avatar {
                    width: 32px;
                    height: 32px;
                    margin-right: 6px;
                    transform: scaleX(-1);

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                // 消息
                .message {
                    position: relative;
                    display: flex;
                    color: #000;
                    height: 24px;
                    padding: 3px 8px;
                    font-size: 14px;
                    background: #ffffff;
                    font-family: "Alimama ShuHeiTi Bold", serif;
                    border-radius: 4px;
                    align-items: center;
                    margin-top: 10px;
                    margin-left: 8px;
                    // 三角形
                    .triangle {
                        position: absolute;
                        left: -6px;
                        top: 6px;
                        border-top: 6px solid transparent;
                        border-right: 8px solid #fff;
                        border-bottom: 6px solid transparent;
                    }

                    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
                }

                //图片显示
                .image-message{
                    position: relative;
                    display: flex;
                    color: #000;
                    //height: 24px;
                    padding: 3px 8px;
                    font-size: 14px;
                    font-family: "Alimama ShuHeiTi Bold", serif;
                    border-radius: 4px;
                    align-items: center;
                    margin-top: 10px;
                    margin-left: 8px;
                    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
                    background: #ffffff;
                    // 三角形
                    .image-triangle {
                        position: absolute;
                        left: -6px;
                        top: 40%;
                        transform: translateY(-50%);
                        border-top: 6px solid transparent;
                        border-right: 8px solid #fff;
                        border-bottom: 6px solid transparent;
                    }

                    /* 图片样式 */
                    img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 4px;
                    }

                }
                .upload {
                    position: relative;
                    display: flex;
                    color: #000;
                    height: 100px;
                    padding: 5px 100px;
                    font-size: 14px;
                    background: #ffffff;
                    font-family: "Alimama ShuHeiTi Bold", serif;
                    border-radius: 8px;
                    //align-items: center;
                    margin-top: 10px;
                    margin-left: 8px;
                    margin-right: 0px;
                    // 三角形
                    .file-triangle {
                        position: absolute;
                        left: -6px;
                        top: 40px;
                        border-top: 6px solid transparent;
                        border-right: 8px solid #fff;
                        border-bottom: 6px solid transparent;
                    }

                    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
                    .load-top{
                        position: absolute;  /* 相对于父容器定位 */
                        display: flex;
                        margin-top: 10px;
                        align-items: center;
                        justify-content: space-between;
                        left: 10px;
                        
                        .photo{
                            margin-left: 10px;
                            justify-items: center;
                        }
                        .top-right{
                            margin-left: 15px;
                            font-size: 12px;

                        }



                    }
                    .line{
                        border-bottom: 1px solid #3A434A;
                    }
                    .load-bottom{
                        position: absolute;
                        display: flex;
                        width: 60%;
                        bottom: 10px;
                        left: 45px;
                        font-size: 13px;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .open:hover{
                        cursor: pointer;
                        color: #ECEFFF;
                    }
                    .copy:hover{
                        cursor: pointer;
                        color: #ECEFFF;
                    }
                    .dload:hover{
                        cursor: pointer;
                        color: #ECEFFF;
                    }
                }
            }

            // 右边
            .right {
                position: relative;
                display: flex;
                margin-top: 10px;
                padding-right: 6px;
                align-items: center;
                /* 终点对齐 */
                justify-content: flex-end;
                // 消息
                .message {
                    position: relative;
                    display: flex;
                    color: #000;
                    height: 24px;
                    padding: 3px 8px;
                    font-size: 14px;
                    background: #55D58B;
                    font-family: "Alimama ShuHeiTi Bold", serif;
                    border-radius: 4px;
                    align-items: center;
                    margin-top: 10px;
                    margin-right: 8px;

                    // 三角形
                    .triangle {
                        position: absolute;
                        right: -6px;
                        top: 6px;
                        border-top: 6px solid transparent;
                        border-left: 8px solid #55D58B;
                        border-bottom: 6px solid transparent;
                        //background-color: #ccc;
                    }

                    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
                }

                //图片显示
                .image-message {
                    position: relative;
                    display: flex;
                    color: #000;
                    padding: 3px 8px;
                    font-size: 14px;
                    font-family: "Alimama ShuHeiTi Bold", serif;
                    border-radius: 4px;
                    align-items: center;
                    margin-top: 10px;
                    margin-right: 8px;
                    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
                    background: #55D58B; /* 可以将背景颜色移到这里 */

                    /* 三角形 */
                    .image-triangle {
                        position: absolute;
                        right: -6px;
                        top: 40%;
                        border-top: 6px solid transparent;
                        border-left: 8px solid #55D58B;
                        border-bottom: 6px solid transparent;
                    }

                    /* 图片样式 */
                    img {
                        max-width: 100%; /* 图片最大宽度为父元素宽度 */
                        height: auto; /* 图片高度自适应 */
                        border-radius: 4px; /* 如果需要的话，也可以添加圆角 */
                    }
                }




                // 头像
                .avatar {
                    width: 32px;
                    height: 32px;
                    margin-left: 6px;
                    transform: scaleX(-1);

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .upload {
                    position: relative;
                    display: flex;
                    color: #000;
                    height: 100px;
                    padding: 5px 100px;
                    font-size: 14px;
                    background: #ffffff;
                    font-family: "Alimama ShuHeiTi Bold", serif;
                    border-radius: 8px;
                    //align-items: center;
                    margin-top: 10px;
                    margin-left: 8px;
                    margin-right: 0px;
                    // 三角形
                    .file-triangle {
                        position: absolute;
                        right: -6px;
                        top: 40px;
                        border-top: 6px solid transparent;
                        border-left: 8px solid #fff;
                        border-bottom: 6px solid transparent;
                    }

                    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
                    .load-top{
                        position: absolute;  /* 相对于父容器定位 */
                        display: flex;
                        margin-top: 10px;
                        align-items: center;
                        justify-content: space-between;
                        left: 10px;

                        .photo{
                            margin-left: 10px;
                            justify-items: center;
                        }
                        .top-right{
                            margin-left: 15px;
                            font-size: 12px;

                        }



                    }
                    .line{
                        border-bottom: 1px solid #3A434A;
                    }
                    .load-bottom{
                        position: absolute;
                        display: flex;
                        width: 60%;
                        bottom: 10px;
                        left: 45px;
                        font-size: 13px;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .open:hover{
                        cursor: pointer;
                        color: #ECEFFF;
                    }
                    .copy:hover{
                        cursor: pointer;
                        color: #ECEFFF;
                    }
                    .dload:hover{
                        cursor: pointer;
                        color: #ECEFFF;
                    }
                }
            }
        }

        //************************************
        //群聊
        .group-chat {
            display: flex;
            width: 100%;

            // 无限滚动
            .infinite-scroll {
                width: 100%;
                height: 484px;
            }

            // 左边
            .left {
                position: relative;
                display: flex;
                margin-top: 10px;
                align-items: center;
                padding-left: 6px;
                // 头像
                .avatar {
                    width: 32px;
                    height: 32px;
                    margin-right: 6px;
                    transform: scaleX(-1);

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                // 消息
                .groupmessage {
                    position: relative;
                    display: flex;
                    color: #000;
                    height: 24px;
                    padding: 3px 8px;
                    font-size: 14px;
                    background: #ffffff;
                    font-family: "Alimama ShuHeiTi Bold", serif;
                    border-radius: 4px;
                    align-items: center;
                    margin-top: 10px;
                    margin-left: 8px;
                    // 三角形
                    .triangle {
                        position: absolute;
                        left: -6px;
                        top: 6px;
                        border-top: 6px solid transparent;
                        border-right: 8px solid #fff;
                        border-bottom: 6px solid transparent;
                    }

                    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
                }
                .upload {
                    position: relative;
                    display: flex;
                    color: #000;
                    height: 100px;
                    padding: 5px 100px;
                    font-size: 14px;
                    background: #ffffff;
                    font-family: "Alimama ShuHeiTi Bold", serif;
                    border-radius: 8px;
                    //align-items: center;
                    margin-top: 10px;
                    margin-left: 8px;
                    margin-right: 0px;
                    // 三角形
                    .triangle {
                        position: absolute;
                        left: -6px;
                        top: 40px;
                        border-top: 6px solid transparent;
                        border-right: 8px solid #fff;
                        border-bottom: 6px solid transparent;
                    }

                    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
                    .load-top{
                        position: absolute;  /* 相对于父容器定位 */
                        display: flex;
                        margin-top: 10px;
                        align-items: center;
                        justify-content: space-between;
                        left: 10px;

                        .photo{
                            margin-left: 10px;
                            justify-items: center;
                        }
                        .top-right{
                            margin-left: 15px;
                            font-size: 12px;

                        }



                    }
                    .line{
                        border-bottom: 1px solid #3A434A;
                    }
                    .load-bottom{
                        position: absolute;
                        display: flex;
                        width: 60%;
                        bottom: 10px;
                        left: 45px;
                        font-size: 13px;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .open:hover{
                        cursor: pointer;
                        color: #ECEFFF;
                    }
                    .copy:hover{
                        cursor: pointer;
                        color: #ECEFFF;
                    }
                    .dload:hover{
                        cursor: pointer;
                        color: #ECEFFF;
                    }
                }
            }

            // 右边
            .right {
                position: relative;
                display: flex;
                margin-top: 10px;
                padding-right: 6px;
                align-items: center;
                /* 终点对齐 */
                justify-content: flex-end;
                // 消息
                .groupmessage {
                    position: relative;
                    display: flex;
                    color: #000;
                    height: 24px;
                    padding: 3px 8px;
                    font-size: 14px;
                    background: #55D58B;
                    font-family: "Alimama ShuHeiTi Bold", serif;
                    border-radius: 4px;
                    align-items: center;
                    margin-top: 10px;
                    margin-right: 8px;

                    // 三角形
                    .triangle {
                        position: absolute;
                        right: -6px;
                        top: 6px;
                        border-top: 6px solid transparent;
                        border-left: 8px solid #55D58B;
                        border-bottom: 6px solid transparent;
                        //background-color: #ccc;
                    }

                    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
                }

                // 头像
                .avatar {
                    width: 32px;
                    height: 32px;
                    margin-left: 6px;
                    transform: scaleX(-1);

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
            }
        }
        //************************************

        // 底部
        .bottom {
            display: flex;
            width: 100%;
            height: 48px;
            font-size: 14px;
            align-items: center;
            justify-content: space-evenly;
            background: #F7FCFF;
            border-radius: 0 0 4px 0;
            // 左边
            .left {
                display: flex;
                align-items: center;
                justify-content: center;
                // 表情包--原来的
                .emoji {
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    margin-right: 2px;
                }

                //**********************
                .picture{
                    display: flex;
                    color: #a9acaf;
                    cursor: pointer;
                    font-size: 28px;
                    font-weight: 400;
                    align-items: center;
                    justify-content: center;
                    margin-right: 2px;
                    
                }
                //***********************

                // 文件
                .file {
                    display: flex;
                    color: #a9acaf;
                    cursor: pointer;
                    font-size: 28px;
                    font-weight: 400;
                    align-items: center;
                    justify-content: center;
                }
            }

            // 中间
            .middle {
                width: 80%;

                :deep(.el-input__inner) {
                    color: #000;
                    font-weight: 600;
                    font-family: "Alimama DongFangDaKai", serif;
                }
            }

            // 右边
            .right {
                display: flex;
                color: #a9acaf;
                cursor: pointer;
                font-size: 28px;
                font-weight: 400;
                align-items: center;
                justify-content: center;
            }

            // 右边鼠标悬浮
            .right:hover {
                color: #409EFF;
            }
        }
    }

}

/*容器*/
.container {
    width: 1180px;
    height: 580px;
    border-radius: 4px;
    //background: #ffffff;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .92);
}

/*主页*/
.home {
    display: flex;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background: #ECEFFF;
}
</style>