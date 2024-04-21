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
                            <div class="option" :class="{ 'active': activeOption === 1 }" @click="handoffPage(1)">
                                <el-icon >
                                    <Comment/>
                                </el-icon>
                            </div>
                            <div class="option" :class="{ 'active': activeOption === 2 }" @click="handoffPage1(2)" >
                                <el-icon>
                                    <Avatar/>
                                </el-icon>
                            </div>
                            <div class="option" :class="{ 'active': activeOption === 3 }" @click="transform(3)">
                                <el-icon >
                                    <WalletFilled/>
                                </el-icon>
                            </div>
                            <!--个人设置-->
                            <div class="option" :class="{ 'active': activeOption === 4 }" @click="personalFormVisible(4)">
                                <el-icon>
                                    <Stamp />
                                </el-icon>
                            </div>
                            <div class="option" :class="{ 'active': activeOption === 5 }" @click="toggleSettingsDialog(5)">
                                <el-icon>
                                    <Tools/>
                                </el-icon>
                            </div>
                            <div class="settings" @click="turnoff">
                                <el-icon>
                                    <SwitchButton />
                                </el-icon>
                            </div>

                            <!--充值-->
                            <el-dialog
                                destroy-on-close
                                v-model="spendvisible"
                                title="钱包"
                                width="40%"
                                center
                                align-center
                                append-to-body
                                style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"


                            >

                                <div class="erweima">
                                    <img  src="../assets/image/theme/home/img/scan.jpg">
                                </div>

                                
                                <el-form-item class="inputmoney" label="请输入金额：">
                                    <el-input class="inputsum" v-model="moneysun" style="width: 360px"  placeholder="输入充值金额"/>
                                    <el-button class="finish" type="success" round @click="finishmoney">充值</el-button>
                                </el-form-item>

                                <div class="ensure">
                                    <el-button class="button1" type="primary" @click="transformexit">退出</el-button>
                                    <el-button class="button2" type="success" @click="save">确定</el-button>
                                </div>

                            </el-dialog>


                            <!--选择主题-->
                            <el-dialog
                                destroy-on-close
                                v-model="dialogVisible"
                                title="选择你喜欢的主题"
                                width="25%"
                                center
                                align-center
                                style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"
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

                            <!--个人表单-->
                            <!--预留接口-->
                            <el-dialog
                                destroy-on-close
                                v-model="personalForm"
                                width="50%"
                                title="我的信息"
                                align-center
                                center
                                draggable
                                close-on-press-escape
                                style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"
                            >
                                <div class="avatar-form">
                                    <!--头像上传-->
                                    <el-upload
                                        class="avatar-uploader"
                                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload"
                                    >
                                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                                    </el-upload>
                                    <!--我的头像-->
                                    <div>我的头像</div>
                                </div>
                                <div class="personal-form">
                                    <el-form :model="form" label-width="auto" style="max-width: 600px">
                                        <!--姓名-->
                                        <el-form-item label="姓名：">
                                            <el-input/>
                                        </el-form-item>
                                        <!--性别-->
                                        <el-form-item label="性别：">
                                            <el-select  placeholder="选择性别">
                                                <el-option label="男" value="male" />
                                                <el-option label="女" value="famale" />
                                            </el-select>
                                        </el-form-item>
                                        <!--年龄-->
                                        <el-form-item label="年龄：">
                                            <el-input-number v-model="age" :min="1" :max="100"  />
                                        </el-form-item>
                                        <!--手机号码-->
                                        <el-form-item label="手机号码：">
                                            <el-input
                                                v-model="phoneNumber"
                                                style="width: 240px"
                                                placeholder="请输入手机号码"
                                                clearable
                                            />
                                        </el-form-item>
                                        <!--邮箱-->
                                        <el-form-item label="邮箱：">
                                            <el-input
                                                v-model="email"
                                                style="width: 240px"
                                                placeholder="请输入邮箱"
                                                clearable
                                            />
                                        </el-form-item>
                                    </el-form>
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
                                <el-input @keyup.enter="searchfriend(search)" v-model="search" placeholder="请输入昵称！！！" :prefix-icon="Search" size="small"/>
                            </div>

                            <!--弹出框显示好友信息-->
                            <el-dialog
                                :before-close="closeTest"
                                destroy-on-close
                                width="35%"
                                title="搜索好友"
                                v-model="searchvisible"
                                align-center
                                center
                                style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"
                            >
                                <div class="A1">
                                    <div v-if="flagFD" class="A2">
                                        <div class="A3">
                                            <img src="@/assets/image/theme/login/other.png" alt="">
                                        </div>
                                        <div class="A4">
                                            昵称：{{searchFriendName}}
                                        </div>
                                        <div class="A5">
                                            谚语：有志者，事竟成！
                                        </div>
                                        <el-button class="A6" type="success" @click="handleClick1(searchFriendName)">聊天</el-button>
                                    </div>

                                    <div v-else style="align-items: center;display: flex;font-size: 30px;margin-left: 35%;">
                                        没有该好友！！！
                                    </div>
                                </div>

                            </el-dialog>


                            <div class="add">
                                <el-dropdown @mouseenter="handleDropdownEnter" @mouseleave="handleDropdownLeave">
                                    <span class="el-dropdown-link">
                                        <el-icon class="icon">
                                            <CirclePlusFilled/>
                                        </el-icon>
                                     </span>
                                    <template #dropdown>
                                        <el-dropdown-menu v-model:visible="dropdownVisible" class="dropdown-menu">
                                            <el-dropdown-item @click="addFriendShow">添加好友</el-dropdown-item>
                                            <el-dropdown-item @click="creatIt">创建群聊</el-dropdown-item>
                                            <el-dropdown-item @click="Invite">邀请进群</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>


                        </div>

<!--                        **************-->
                        <!--创建群聊界面-->
                        <el-dialog
                            class="createGROUP"
                            destroy-on-close
                            :before-close="closeTest"
                            v-model="creatGroup"
                            width="45%"
                            align-center
                            center
                            :show-close="true"
                            title="创建群聊"
                            draggable
                            close-on-press-escape
                            style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"

                        >
                            <div class="information">
                                <el-form-item label="群名：" style="font-size: 20px">
                                    <el-input
                                        placeholder="请输入群名！！"
                                        v-model="inputGroupName"
                                        clearable
                                        class="input-GroupName"
                                    >
                                    </el-input>
                                </el-form-item>

                                <!--全选好友-->
                                <el-checkbox
                                    v-model="checkAll"
                                    :indeterminate="isIndeterminate"
                                    @change="handleCheckAllChange"
                                    class="check-all"
                                >
                                    全选
                                </el-checkbox>
                            </div>
                            <div class="createGroup" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll" >
                                <el-checkbox-group
                                    v-model="selectedFriends"
                                    @change="handleFriendSelectionChange"
                                >
                                    <div class="find-friends" v-for="(friend,index) in friendsListInfo" :key="index" >
                                        <el-checkbox
                                            :key="friend.nickname"
                                            :label="friend.nickname"
                                            class="Friend"
                                        >
                                            <!--头像-->
                                            <div class="friend-avatar">
                                                <img src="@/assets/image/theme/login/other.png" alt="">
                                            </div>
                                            <!--昵称-->
                                            <div class="friend-nickname">昵称:{{friend.nickname}}</div>
                                            <!--个人简介-->
                                            <div class="friend-latest-notice">
                                                大家好！我是{{friend.nickname}}
                                            </div>

                                        </el-checkbox>


                                    </div>
                                </el-checkbox-group>
                            </div>
                            <div class="operate">
                                <el-button type="success" @click="exitgroup">退出</el-button>
                                <el-button class="createbutton" type="success" @click="create">创建</el-button>
                            </div>
                        </el-dialog>
<!--                        ****************-->


<!--                        添加好友界面-->
                        <el-dialog
                            destroy-on-close
                            v-model="addFriendVisible"
                            width="45%"
                            title="添加好友"
                            center
                            align-center
                            draggable
                            close-on-press-escape
                            style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"

                        >
                            <div>
                                <el-input
                                    v-model="inputFrriend"
                                    style="max-width: 600px"
                                    placeholder="输入好友昵称！！！"
                                    clearable
                                >
                                    <template #prepend style="font-weight: bold">好友昵称：</template>
                                </el-input>
                                <el-button type="primary" :icon="Search" style="margin-left: 20px" @click="searchFriends">搜索</el-button>
<!--                                查询显示区域-->
                                <div class="searchFriend">
                                    <!--查询到相应账户-->
                                    <div class="findOut" v-if="find">
                                        <div class="add-avatar">
                                            <img src="@/assets/image/theme/login/other.png" alt="">
                                        </div>

                                        <!--格言-->
                                        <div class="maxim">我的格言：奥里给！！</div>

                                        <!--昵称-->
                                        <div class="Friends-name">昵称：{{friendName}}</div>
                                        <el-button class="add" type="success" @click="addFriends" round>添加</el-button>


                                    </div>

                                    <!--未查询到相应账户-->
                                    <div class="no-Finding" v-else>
                                        没有找到该用户......

                                    </div>

                                </div>

                                <div class="bottomFriend">
                                    <el-button type="primary" @click="Exit" round>退出</el-button>
                                    <el-button class="Add-exit" type="success" @click="inSure" round>确定</el-button>

                                </div>
                            </div>

                        </el-dialog>

<!--                        添加好友界面-->

<!--                        邀请进群界面-->
                        <el-dialog
                            destroy-on-close
                            title="邀请进群"
                            v-model="InviteVisible"
                            center
                            align-center
                            width="35%"
                            class="select-Friend-to-group"
                            append-to-body
                            draggable
                            close-on-press-escape
                            style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"

                        >
                            <div class="Invite-Top">
                                <!--级联选择器-->
                                <el-select class="select-Groups" v-model="value" placeholder="请选择群聊" style="width: 240px">
                                    <el-option
                                        v-for="item in personalGroupDisplay"
                                        :key="item.groupname"
                                        :label="item.groupname"
                                        :value="item.groupname"
                                        @click="ShowFriend(value)"
                                    />
                                </el-select>

                                <!--全选好友-->
                                <el-checkbox
                                    v-model="checkall"
                                    :indeterminate="Partially"
                                    @change="handlePartiallyChange"
                                    class="check-Friends"
                                >
                                    全选
                                </el-checkbox>

                            </div>
                            <div class="Invite" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll">
                                <el-checkbox-group
                                    v-model="selectedFriendsList"
                                    @change="handleFriendsListSelectionChange"
                                >
                                    <div class="Invite-Friends" v-for="(friend,index) in Friends" :key="index">
                                        <el-checkbox
                                            :key="index"
                                            :label="friend"
                                            class="Invite-Friend"
                                        >
                                            <div class="Invite-avater">
                                                <img src="@/assets/image/theme/login/other.png" alt="">
                                            </div>
                                            <div class="Invite-nickname">昵称：{{friend}}</div>
                                            <div class="Invite-introduce">大家好！我是{{friend}}</div>

                                        </el-checkbox>

                                    </div>

                                </el-checkbox-group>


                            </div>
                            <div class="InviteSure">
                                <el-button type="success" @click="InviteFriend">邀请</el-button>
                                <el-button class="Invite-exit" @click="exitInvite" type="danger">退出</el-button>
                            </div>

                        </el-dialog>
<!--                        邀请进群界面-->
                        <!--好友列表无限滚动-->
                        <div class="infinite-scroll" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll" v-if="handoff">
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
                            <div class="group"  @click="handleClick('public',group)" v-for="(group,index) in personalGroupDisplay" :key="index">
                                <!--头像-->
                                <div class="group-avatar">
                                    <img src="@/assets/image/theme/login/other.png" alt="">
                                </div>
                                <!--好友消息-->
                                <div class="group-message">
                                    <!--昵称-->
                                    <div class="group-nickname">
                                        <div>{{group.groupname}}</div>
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


                        <!--群聊和好友列表-->
                        <div class="infinite-scroll-public" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll" v-if="handoff1">
                            <!--好友添加通知-->
                            <div class="newFriend">
                                <div class="friend-zi-top">
                                    新的朋友
                                </div>
                                <!--朋友通知-->
                                <div class="Friend-notifications" @click="Show">
                                    <el-icon style="font-size: 38px;margin-left: 10px">
                                        <Avatar />
                                    </el-icon>
                                    <div class="friend-zi">
                                        新的朋友
                                    </div>
                                </div>
                                <!--分割线-->
                                <div style="width: 100%; height: 1px;background-color: #A6B6C3; margin-top: 4px"></div>
                            </div>

                            <!--好友列表-->
                            <div class="freindList">
                                <div class="myFriend">
                                    我的朋友
                                </div>
                                <div class="friendNum" v-for="(friend,index) in friendsListInfo" :key="index">
                                    <!--头像-->
                                    <div class="friend-avatar-list">
                                        <img src="@/assets/image/theme/login/other.png" alt="">
                                    </div>
                                    <div class="friend-information">
                                        <!--好友昵称-->
                                        <div class="friend-nickname-list">
                                            {{friend.nickname}}
                                        </div>
                                        <!--最新通知-->
                                        <div class="friend-introduce-list">
                                            我的名字叫老八，是个地道美食家！
                                        </div>
                                    </div>

                                </div>
                                <!--分割线-->
                                <div style="width: 100%; height: 1px;background-color: #A6B6C3; margin-top: 4px"></div>


                            </div>

                            <!--群聊列表-->
                            <div class="groupList">
                                <div class="myGroup">
                                    我的群聊
                                </div>
                                <div class="groupNum" v-for="(group,index) in personalGroupDisplay" :key="index">
                                    <!--群聊头像-->
                                    <div class="group-avatar-list">
                                        <img src="@/assets/image/theme/login/other.png" alt="">
                                    </div>
                                    <div class="group-information">
                                        <!--好友昵称-->
                                        <div class="group-nickname-list">
                                            {{group.groupname}}
                                        </div>
                                        <!--最新通知-->
                                        <div class="group-introduce-list">
                                            吕德华，我操你阿玛！
                                        </div>

                                    </div>
                                </div>
                                <!--分割线-->
                                <div style="width: 100%; height: 1px;background-color: #A6B6C3; margin-top: 4px"></div>
                            </div>
                        </div>

                    </div>
                </el-col>
                <!--v-if="flag"-->
                <el-col class="private" v-if="flag&&control"  :span="16">
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
                                            <img  v-if="message.message !== ''" :src="message.message" alt="Uploaded Image" style="max-width: 120px; max-height: 120px;" @click="openDialog(message.message)">
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
                                            <img v-if="message.message !== ''" :src="message.message" alt="Uploaded Image" style="max-width: 120px; max-height: 120px;display: block" @click="openDialog(message.message)">

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
                                    style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"
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
                                    style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"
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
                <!--v-else-->
                <el-col class="public" v-else-if="!flag&&control" :span="16">
                    <!--多人聊天-->
                    <div class="grid-content chats" :style="{backgroundColor: savedColorchats}">
                        <!--群聊顶部-->
                        <div class="group-top" :style="{backgroundColor: savedColortop}">
                            <!--昵称-->
                            <div class="group-nickname">{{currentGroupInfo.groupname}}</div>
                            <!--在线状态-->
                            <div class="status1">
                                <!--状态-->
                                <div class="state1"></div>
                                <!--群聊人数-->
                                <div class="group-number">{{currentGroupInfo.groupNumber}}人</div>
                            </div>
                        </div>

                        <!--群聊-->
                        <div class="group-chat">
                            <!--无限滚动-->
                            <div class="infinite-scroll" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll">
                                <div v-for="(groupmessage,index) in currentGroupInfo.messages" :key="index">
                                    <!--左边-->
                                    <div class="left" v-if="groupmessage.type === 'friend'">
                                        <!--头像-->
                                        <div class="avatar">
                                            <img src="@/assets/image/theme/login/other.png" alt="">
                                        </div>

                                        <div class="groupmessage" v-if="groupmessage.sort==='text'">
                                            {{groupmessage.message}}
                                            <!--三角形-->
                                            <div class="triangle"></div>
                                        </div>

                                        <!--图片消息-->
                                        <div class="groupimage-message" v-else-if="groupmessage.sort === 'image'">
                                            <img  v-if="groupmessage.message !== ''" :src="groupmessage.message" alt="Uploaded Image" style="max-width: 120px; max-height: 120px;" @click="openDialogGroup(groupmessage.message)">
                                            <!--三角形-->
                                            <div class="groupimage-triangle"></div>
                                        </div>

                                        <!--文件类型-->
                                        <div class="groupupload" v-else-if="groupmessage.sort === 'file'">
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
                                                <el-link class="dload" @click="download(groupmessage.message)">下载</el-link>
                                            </div>
                                            <!--三角形-->
                                            <div class="file-triangle"></div>
                                        </div>

                                    </div>
                                    <!--右边-->
                                    <div class="right" v-else-if="groupmessage.type === 'my'">
                                        <!--文本消息-->
                                        <div class="groupmessage" v-if="groupmessage.sort === 'text'">
                                            {{groupmessage.message}}
                                            <!--三角形-->
                                            <div class="triangle"></div>
                                        </div>

                                        <!--图片消息-->
                                        <div class="groupimage-message" v-else-if="groupmessage.sort === 'image'">
                                            <img v-if="groupmessage.message !== ''" :src="groupmessage.message" alt="Uploaded Image" style="max-width: 120px; max-height: 120px;" @click="openDialogGroupRight(groupmessage.message)">
                                            <!--三角形-->
                                            <div class="groupimage-triangle"></div>
                                        </div>

                                        <!--文件类型-->
                                        <div class="groupupload" v-else-if="groupmessage.sort === 'file'">
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
                                                <el-link class="dload" @click="download(groupmessage.message)">下载</el-link>
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
                                    v-model="dialogGroupleft"
                                    title="图片预览"
                                    width="50%"
                                    align-center
                                    center
                                    style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"
                                >
                                    <el-image style="width: auto; height: auto"
                                              :src="imageGroupleft" :fit="'cover'"
                                    />
                                </el-dialog>

                                <!--右侧预览图片-->
                                <el-dialog
                                    :before-close="closeTest"
                                    destroy-on-close
                                    v-model="dialogGroupright"
                                    title="图片预览"
                                    width="50%"
                                    align-center
                                    center
                                    style="background-color: #f3f3f3; border-radius: 10px; font-weight: bold; font-family: 'Alimama DongFangDaKai', serif"
                                >
                                    <el-image style="width: auto; height: auto"
                                              :src="imageGroupright" :fit="'cover'"
                                    />
                                </el-dialog>


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
                                <!--表情包-->
                                <el-form class="emoji" >
                                    <el-form-item>
                                        <ElIconPicker v-model="icon" @select-icon="grouphandleSelectIcon">></ElIconPicker>
                                    </el-form-item>
                                </el-form>

                                <!--图片-->
                                <div class="picture">
                                    <el-icon @click="opengroupFilePicker">
                                        <Picture />
                                    </el-icon>
                                </div>

                                <!--文件-->
                                <div class="file">
                                    <el-icon @click="opengroupFilePickerfile">
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

                <!--好友添加和邀请好友进入群聊消息确认-->
                <el-col class="Message-confirmation" v-if="FormVisible" :span="16">
                    <!--消息确认-->
                    <div class="grid-content Ensure">
                        <!--接收消息顶部-->
                        <div class="information-top">

                        </div>

                        <!--中间消息滚动-->
                        <div class="information-middle" style="overflow: auto" v-infinite-scroll="loadInfiniteScroll">
                            <!--单个对象-->
                            <!--v-for="(friend,index) in Information " :key="index"-->
                            <div 
                                style="font-weight: bold;
                                font-family: 'Alimama DongFangDaKai', serif;
                                margin-top: 5px;
                                margin-right: 700px;
                            ">
                                新的朋友
                            </div>
                            <div style="width: 100%;background-color: #3A434A;height: 2px;margin-bottom: 5px"></div>
                            <div class="single-object" v-for="(friend,index) in Information " :key="index"  >
                                <!--添加好友头像-->
                                <div class="add-avatar-form">
                                    <img src="@/assets/image/theme/login/other.png" alt="">
                                </div>
                                <!--昵称和个人谚语-->
                                <div class="form-form">
                                    <!--{{friend.friendname}}-->
                                    <div>{{friend.friendname}}</div>
                                    <div>干了奥！~兄弟们</div>
                                </div>

                                <!--添加按钮-->
                                <div class="add-Person">
                                    <!--@click="agree(friend.friendname)"-->
                                    <el-button type="success" @click="agree(friend.friendname)" >同意</el-button>
                                </div>

                            </div>

                            <!--下半部分为同意好友邀请-->
                            <div
                                style="font-weight: bold;
                                font-family: 'Alimama DongFangDaKai', serif;
                                margin-top: 20px;
                                margin-right: 700px;
                            ">
                                群聊邀请
                            </div>
                            <div style="width: 100%;background-color: #3A434A;height: 2px;margin-bottom: 5px;"></div>
                            <div class="invite-friend-form" v-for="(friend,index) in InviteInformation " :key="index">
                                <!--群聊头像-->
                                <div class="invite-friend-form-avatar">
                                    <img src="@/assets/image/theme/login/other.png" alt="">
                                </div>
                                <!--群名和邀请者-->
                                <div class="invite-friend-form-item">
                                    <div class="invite-friend-form-groupName">群名：{{friend.groupName}}</div>
                                    <div class="invite-friend-form-Inviter">{{friend.Inviter}}邀请您加入群聊！</div>
                                </div>
                                <!--添加按钮-->
                                <div class="invite-friend-add-Person">
                                    <!--@click="agree(friend.friendname)"-->
                                    <el-button type="success" @click="AgreeToGroup(friend.groupName , friend.Inviter)">同意</el-button>
                                </div>

                            </div>

                        </div>
                        <!--底部-->
                        <div class="information-bottom">

                        </div>

                    </div>

                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts" setup>

// 点击聊天进入界面
const handleClick1 = (name) => {
    console.log("选择的好友是："+name)
    if(name != ''){
        flag.value = true
        friendsInfo.value = name
    }
    console.log(flag.value)
    searchvisible.value = false
}


// 搜索好友
const flagFD = ref(false)
const searchfriend = async (value) => {
    searchvisible.value = !searchvisible.value
    if(await userStore.searchFd(value)){
        flagFD.value = true
    }
    else {
        flagFD.value = false
    }
    search.value = ''
}



//断开连接函数
const turnoff = async () => {
    await userStore.webSocketInstance.close();
    await router.push({
        name: 'login'
    })
}

import { ref, reactive, toRefs} from 'vue'
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


//群聊选择图片
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
                    await userStore.sendGroupImage(userStore.imageUrl1)
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
                    await userStore.sendGroupFile(userStore.fileUrl)
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
const toggleSettingsDialog = (value) => {
    activeOption.value = value
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
import ElIconPicker from "../components/el-icon-picker.vue";
const icon = ref('');
// 监听子组件 ElIconPicker 中选中表情的事件
const handleSelectIcon = (emoji: string) => {
    message.value += emoji; // 将选中的表情添加到输入框的值中
};
const grouphandleSelectIcon = (emoji: string) => {
    groupmessage.value += emoji; // 将选中的表情添加到输入框的值中
};

const {nickname, friendsInfo, friendsListInfo} = storeToRefs(userStore)

const network = reactive(useNetwork())
const {isOnline} = toRefs(network)

// 搜索好友
const search = ref('')
const message = ref('')
const loadInfiniteScroll = () => {

}


import router from "../router";
import {ElMessage, ElNotification, UploadProps} from "element-plus";
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
const {searchFriendName, personalGroupDisplay , friendName ,Information , Result , NotInTheGroup , InviteInformation} = storeToRefs(userStore)
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

console.log(userStore.fileUrl)



//点击下载,下载文件
const download = (url: string) => {
    console.log("链接为："+url)
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


//群聊显示图片
//左侧显示
const imageGroupleft = ref('')
const dialogGroupleft = ref(false)

const openDialogGroup = (url: string) => {
    dialogGroupleft.value = !dialogGroupleft.value
    imageGroupleft.value = url
}

//右侧显示
const imageGroupright = ref('')
const dialogGroupright = ref(false)

const openDialogGroupRight = (url: string) => {
    dialogGroupright.value = !dialogGroupright.value
    imageGroupright.value = url
}


//搜索框显示个人信息
const searchvisible = ref(false)

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

import {CreateGroup} from "../store/group.ts";
import * as url from "url";
const creategp = CreateGroup()

// 创建群聊
const create = async () =>{
    // 输入姓名与群成员
    ensureMembers.value = selectedFriends.value
    // 确定下来的群成员
    // 将自己加入到群集合
    ensureMembers.value.push(nickname.value)
    if(await creategp.creategroup(inputGroupName.value, ensureMembers.value)){
        if(await userStore.createGroup(inputGroupName.value, ensureMembers.value)){
            ElNotification({
                title:'Success',
                message: "创建群聊成功！！",
                type:"success",
            })
            console.log("创建成功！！")
        }
        else {
            ElNotification({
                title:'Error',
                message: "创建群聊失败！！",
                type:"error",
            })
        }
        creatGroup.value = false

    }
    else {
        creatGroup.value = false
        ElNotification({
            title:'Error',
            message: "error",
            type:"error",
        })

    }
    // 清空暂存区域
    selectedFriends.value = []
    ensureMembers.value = []

}

//全选框
// 全选复选框状态
const checkAll = ref(false)
// 部分选中状态
const isIndeterminate = ref(true)

//存放已选择好友
const selectedFriends = ref([])

//确定下来的群成员
const ensureMembers = ref([])

//全选状态改变
//check用来判断是否为 全选
const handleCheckAllChange = (val: boolean) => {
    console.log(val)
    // 遍历所有好友，更新其复选框状态
    selectedFriends.value = val? friendsListInfo.value.map(friend => friend.nickname):[]
    console.log(selectedFriends.value)
    isIndeterminate.value = false // 取消部分选中状态

}
// 单个好友复选框状态改变
const handleFriendSelectionChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === friendsListInfo.value.length
    isIndeterminate.value = checkedCount > 0&& checkedCount < friendsListInfo.value.length
}



//充值窗口弹出
const spendvisible = ref(false)
const moneysun = ref()

const transform = (option: number) => {
    activeOption.value = option
    spendvisible.value = !spendvisible.value
}
const transformexit = () => {
    spendvisible.value = !spendvisible.value
}
const save = () => {
    spendvisible.value = !spendvisible.value
}

const finishmoney = () => {
    spendvisible.value = !spendvisible.value
}



const dropdownVisible = ref(false);

const handleDropdownEnter = () => {
    dropdownVisible.value = true;
}

const handleDropdownLeave = () => {
    dropdownVisible.value = false;
}


//弹出添加好友界面
const addFriendVisible = ref(false)
const addFriendShow = () => {
    addFriendVisible.value = !addFriendVisible.value
}

//添加好友响应式变量
const inputFrriend = ref('')

//搜索好友
//控制显示是否存在该好友
const find = ref(false)
const searchFriends = async () =>{
    if(inputFrriend.value){
        const result = await userStore.findFriends(inputFrriend.value)
        if ( result === 'findOut'){
            inputFrriend.value= ''
            find.value = true
            console.log("找到这个好友了！！"+friendName.value)
        }
        else if(result === 'NotFound'){
            inputFrriend.value = ''
            find.value = false
            console.log("没有这个人！！！")
        }
        else{
            find.value = false
            inputFrriend.value= ''
            ElNotification({
                title: '温馨提示！！',
                message: '禁止搜索自己！！！',
                type: "warning",
            });
        }
    }

}
//添加好友
const addFriends = () => {
    // 调用 addFriend 并等待结果
    userStore.addFriend(friendName.value);
    // 等待 addFriend 完成后再访问 userStore.Result
    console.log("错误类型为："+Result.value)
    if (Result.value === 'repeatAdd') {
        ElNotification({
            title: '温馨提示！！',
            message: '不能添加已存在好友！！',
            type: "warning",
        });
    }
    else if (Result.value === 'noPerson') {
        ElNotification({
            title: '温馨提示！！',
            message: '该用户已经不存在！！！！',
            type: "warning",
        });
    }
}


//确定与退出
const inSure = () => {
    addFriendVisible.value = false
}
const Exit = () => {
    addFriendVisible.value = false
}

// 实现切换主页面和好友页面
const handoff = ref(true)
const handoff1 = ref(false)
const handoffPage = (option: number) => {

    // 显示是否同意添加为好友
    // 点击后不渲染
    FormVisible.value = false
    // 控制单聊与群聊正常显示
    control.value = true

    activeOption.value = option
    handoff.value = true
    handoff1.value = false
}

const handoffPage1 = (option: number) => {
    activeOption.value = option
    handoff.value = false
    handoff1.value = true
}

// 控制左侧显示
// 当前选中的选项
const activeOption = ref(1);

// 添加好友信息部分
const FormVisible = ref(false)
// 控制添加好友信息显示部分
const control = ref(true)
const Show = () => {
    FormVisible.value = true
    control.value = false

}
// 发送同意请求
const agree = (freindName: string) => {
    userStore.addAgree(freindName)
}


// 邀请进群
const InviteVisible = ref(false)
// 打开或关闭邀请好友弹出窗
const Invite = () => {
    InviteVisible.value = !InviteVisible.value
}

// 邀请进群，选择群聊
// 群聊名称
const value = ref('')
// 暂存不在群聊里的好友
const Friends = ref([])
const ShowFriend = (groupName: any) => {
    for (let i = 0; i < NotInTheGroup.value.length; i++){
        if(NotInTheGroup.value[i].groupName === groupName){
            // 赋值给Friends数组
            Friends.value = NotInTheGroup.value[i].members
            console.log(JSON.stringify(Friends.value))
            break;
        }
    }
    console.log("点击输出的结果为："+groupName)
}

// 邀请好友进群全选控制
const checkall = ref(false)
// 部分选中状态
const Partially = ref(true)

//存放已选择好友
const selectedFriendsList = ref([])

//确定下来的群成员
const Members = ref([])

//全选状态改变
//check用来判断是否为 全选
const handlePartiallyChange = (val: boolean) => {
    console.log(val)
    // 遍历所有好友，更新其复选框状态
    selectedFriendsList.value = val? Friends.value:[]
    console.log(selectedFriendsList.value)
    Partially.value = false // 取消部分选中状态

}

// 单个好友复选框状态改变
const handleFriendsListSelectionChange = (value: string[]) => {
    const checkedCount = value.length
    checkall.value = checkedCount === Friends.value.length
    Partially.value = checkedCount > 0&& checkedCount < Friends.value.length
}

// 邀请好友进群
const InviteFriend = async () => {
    if(await userStore.InvieFriends(value.value, selectedFriendsList.value)){
        ElNotification({
                title:'Success',
                message: "邀请成功！！",
                type:"success",
            })
        InviteVisible.value = false
        selectedFriendsList.value = []
    }
}
const exitInvite = () => {
    InviteVisible.value = false
}
// 同意进入群聊
const AgreeToGroup = (groupname: string , inviter: string) => {
    console.log("群名为："+groupname+"邀请者为："+inviter)
    userStore.AgreeToTheGroup(groupname, inviter);
}

// 个人信息填写与更改
const personalForm = ref(false)
const personalFormVisible = (option:number) => {
    activeOption.value = option
    personalForm.value = !personalForm.value
}

// 上传头像url
const imageUrl = ref('')

// 成功触发后的回调函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

// 对上传图片进行检查
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg'];

    if (!allowedFormats.includes(rawFile.type)) {
        ElMessage.error('头像格式必须是png、jpg或者jpeg!!!');
        return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像大小不能超过2MB！');
        return false;
    }
    return true;
}

// 表单内容
const age = ref(1)
// 手机号码
const phoneNumber = ref('')
// 邮箱
const email = ref('')


</script>

<style lang="scss" scoped>

// 搜索好友
.A1{
    display: flex;
    width: 100%;
    height: 150px;
    background-color: #A6B6C3;
    border-radius: 5px;

    .A2{
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        margin-top: 5px;
        width: 100%;
        height: 60px;
        background-color: #ECEFFF;
        border-radius: 5px;

        .A3{
            width: 45px;
            height: 45px;

            img{
                border-radius: 50%;
                width: 100%;
                height: 100%;
            }
        }

    }
}


.avatar-form{
    display: flex;
    flex-direction: column;
    align-items: center;
}
// 上传图片
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.bottomFriend{
    margin-top: 20px;
    .Add-exit{
        margin-left: 50px;
    }
}

.searchFriend{
    margin-top: 20px;
    width: 100%;
    height: 200px;
    background-color: #e6e6e6;
    border-radius: 5px;

    .findOut{
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        height: 80px;
        width: 100%;
        background-color: #b7b7b7;
        top: 10px;
        border-radius: 5px;

        // 头像
        .add-avatar {
            //margin-top: 12px;
            //margin-left: 30px;
            width: 54px;
            height: 54px;
            margin-left: 40px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        //好友昵称
        .Friends-name{
            font-family: "Alimama ShuHeiTi Bold" , serif;
            font-weight: bold;
        }

        //格言
        .maxim{
            font-family: "Alimama DongFangDaKai" , serif;
            font-weight: bold;
        }
        
        //添加按钮
        .add{
            margin-right: 50px;
        }
    }
    .findOut:hover{
        background-color: #999999;
    }

    .no-Finding{
        position: relative;
        display: flex;
        justify-content: center;
        top: 81.5px;
        font-weight: bold;
        font-family: "Alimama DongFangDaKai" , serif;
        font-size: 25px;
        

    }
}


.createGROUP{
    border-radius: 10px;
}

.ensure{
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    .button1{
        margin-left: 120px;
    }
    .button2{
        margin-right: 120px;
    }
}
.inputmoney{
    font-family: "Alimama ShuHeiTi Bold" , serif;
    display: flex;
    margin-top: 50px;
    margin-left: 85px;

    .finish{
        margin-left: 20px;
    }
}

.erweima{
    display: flex;
    margin-left: 230px;
    img{
        width: 250px;
        height: 250px;
    }
}

// 修改弹出框样式



// 邀请好友进群顶部
.Invite-Top{
    margin-bottom: 20px;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    .select-Groups{
        margin-left: 12px;
    }
    
    .check-Friends{
        margin-left: 20px;
    }
    

    .check-Friends:deep(.el-checkbox__inner){
        border-radius: 50%;
    }
    .select-Groups:deep(.el-input__wrapper){
        border-radius: 5px;
    }
    .select-Groups:deep(.el-input__inner){
        font-family: "Alimama DongFangDaKai" , serif;
        font-weight: bold;
    }
}
// 邀请好友进群
.Invite{
    border-radius: 5px;
    background: #f9f9f9;
    width: 600px;
    height: 400px;
    padding: 10px;
    
    .Invite-Friends{
        border-radius: 5px;
        background: #ECEFFF;
        display: flex;
        align-items: center;
        padding: 10px;
        margin-bottom: 10px;
        transition: background 0.3s;
        .Invite-Friend{

        }
        .Invite-Friend:deep(.el-checkbox__label){
            display: flex;
            align-items: center;
            justify-items: center;

            // 头像
            .Invite-avater {
                margin-left: 30px;
                margin-right: 30px; /* 为头像和昵称之间添加更多间隔 */
                width: 35px;
                height: 35px;
            }
            .Invite-avater img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .Invite-nickname{
                font-family: "Alimama DongFangDaKai" , serif;
                font-weight: bold;
                display: block; /* 确保它们是块级元素，可以应用边距 */
                margin-right: 20px; /* 添加间距，以便它们不会紧挨在一起 */
                margin-left: 50px;
            }
            .Invite-introduce{
                font-family: "Alimama ShuHeiTi Bold" , serif;
                font-weight: bold;
                display: block; /* 确保它们是块级元素，可以应用边距 */
                margin-right: 20px; /* 添加间距，以便它们不会紧挨在一起 */
                margin-left: 50px;

            }

        }

        .Invite-Friend:deep(.el-checkbox__inner){
            border-radius: 50%;
        }

    }

    .Invite-Friends:hover {
        background: #A6B6C3;
    }
}
// 邀请好友底部
.InviteSure{
    margin-top: 20px;
    .Invite-exit{
        margin-left: 50px;
    }
}

// 创建群聊界面
.createGroup {
    border-radius: 5px;
    background: #f9f9f9;
    width: 785px;
    height: 400px;
    padding: 10px;

    .find-friends {
        border-radius: 5px;
        background: #ECEFFF;
        display: flex;
        align-items: center;
        padding: 10px;
        margin-bottom: 10px;
        transition: background 0.3s;

        .Friend:deep(.el-checkbox__inner){
            border-radius: 50%;

        }
        .Friend:deep(.el-checkbox__label){
            display: flex;
            align-items: center;
            justify-items: center;

            .friend-avatar {
                margin-left: 30px;
                margin-right: 30px; /* 为头像和昵称之间添加更多间隔 */
                width: 35px;
                height: 35px;
            }

            .friend-avatar img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .friend-nickname{
                font-family: "Alimama DongFangDaKai" , serif;
                font-weight: bold;
                display: block; /* 确保它们是块级元素，可以应用边距 */
                margin-right: 20px; /* 添加间距，以便它们不会紧挨在一起 */
                margin-left: 50px;
            }
            .friend-latest-notice {
                font-family: "Alimama ShuHeiTi Bold" , serif;
                font-weight: bold;
                display: block; /* 确保它们是块级元素，可以应用边距 */
                margin-right: 20px; /* 添加间距，以便它们不会紧挨在一起 */
                margin-left: 50px;
            }
        }
    }
    .find-friends:hover {
        background: #A6B6C3;
    }
}

// 退出与创建按钮
.operate{
    margin-top: 20px;
    .createbutton{
        margin-left: 50px;
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
    .check-all:deep(.el-checkbox__inner){
        border-radius: 50%;
    }
    .input-GroupName:deep(.el-input__inner){
        font-family: "Alimama DongFangDaKai" , serif;
        font-weight: bold;
    }
    .input-GroupName:deep(.el-input__wrapper){
        border-radius: 5px;
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

            .option.active {
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
                color: red;
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
            .el-dropdown-link{
                border-radius: 20px;
                border: none !important;

            }
            //.el-dropdown-link:hover{
            //    color: #ffffff;
            //}
            .icon{
                display: flex;
                cursor: pointer;
                font-size: 24px;
                align-items: center;
                justify-content: center;
                color: #606266;
            }
            .icon:hover{
                color: #ffffff;
            }



            //.add {
            //    display: flex;
            //    cursor: pointer;
            //    font-size: 24px;
            //    align-items: center;
            //    justify-content: center;
            //    color: #606266;
            //}
            //
            //.add:hover {
            //    color: #ffffff;
            //}
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

       // 全部东西加载
        .infinite-scroll-public {
             background-color: #ECEFFF;
             width: 100%;
             height: 530px;
            .newFriend{
               margin-top: 10px;
               .friend-zi-top{
                   font-size: 13px;
                   font-weight: bold;
                   font-family: "Alimama ShuHeiTi Bold" , serif;
                   margin-right: 210px;
                   margin-bottom: 8px;
               }
               .Friend-notifications{
                   display: flex;
                   justify-content: flex-start;
                   align-items: center;
                   height: 60px;
                   background-color: #A6B6C3;
                   cursor: pointer;
                   border-radius: 5px;
                   .friend-zi{
                       margin-left: 20px;
                       font-family: "Alimama DongFangDaKai" , serif;
                       font-weight: bold;
                   }
               }
           }
            .Friend-notifications:hover{
                background: #c3c3c3;
            }

            .freindList{
                margin-top: 10px;
                .myFriend{
                    font-size: 13px;
                    font-weight: bold;
                    font-family: "Alimama ShuHeiTi Bold" , serif;
                    margin-right: 210px;
                    margin-bottom: 8px;
                }
                .friendNum{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 60px;
                    background-color: #A6B6C3;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-bottom: 2px;
                    .friend-avatar-list{
                        margin-left: 10px;
                        width: 38px;
                        height: 38px;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .friend-information{
                        display: flex;
                        width: 210px;
                        text-align: left;
                        flex-direction: column;
                        // 昵称
                        .friend-nickname-list {
                            display: flex;
                            color: #fff;
                            font-size: 12px;
                            font-family: "Alimama DongFangDaKai", serif;
                            justify-content: space-between;

                        }
                        // 最新通知
                        .friend-introduce-list {
                            font-weight: bold;
                            width: 210px;
                            color: #000;
                            font-size: 12px;
                            font-family: "Alimama DongFangDaKai", serif;
                            text-overflow: ellipsis; /* ellipsis:显示省略符号来代表被修剪的文本  string:使用给定的字符串来代表被修剪的文本*/
                            white-space: nowrap; /* nowrap:规定段落中的文本不进行换行   */
                            overflow: hidden; /*超出部分隐藏*/
                        }
                    }

                }

            }
            .friendNum:hover{
                background: #c3c3c3;
            }

            .groupList{
                margin-top: 10px;
                .myGroup{
                    font-size: 13px;
                    font-weight: bold;
                    font-family: "Alimama ShuHeiTi Bold" , serif;
                    margin-right: 210px;
                    margin-bottom: 8px;
                }
                .groupNum{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 60px;
                    background-color: #A6B6C3;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-bottom: 2px;
                    .group-avatar-list{
                        margin-left: 10px;
                        width: 38px;
                        height: 38px;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .group-information{
                        display: flex;
                        width: 210px;
                        text-align: left;
                        flex-direction: column;
                        // 昵称
                        .group-nickname-list {
                            display: flex;
                            color: #fff;
                            font-size: 12px;
                            font-family: "Alimama DongFangDaKai", serif;
                            justify-content: space-between;

                        }
                        // 最新通知
                        .group-introduce-list {
                            font-weight: bold;
                            width: 210px;
                            color: #000;
                            font-size: 12px;
                            font-family: "Alimama DongFangDaKai", serif;
                            text-overflow: ellipsis; /* ellipsis:显示省略符号来代表被修剪的文本  string:使用给定的字符串来代表被修剪的文本*/
                            white-space: nowrap; /* nowrap:规定段落中的文本不进行换行   */
                            overflow: hidden; /*超出部分隐藏*/
                        }
                    }

                }
            }
            .groupNum:hover{
                background: #c3c3c3;
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
                //图片显示
                .groupimage-message{
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
                    .groupimage-triangle {
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
                .groupupload {
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

                //图片显示
                .groupimage-message {
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
                    .groupimage-triangle {
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
                .groupupload {
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


    // 消息确认
    .Ensure{
        //新加的
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        border-radius: 0 4px 4px 0;
        background-color: white;

        // 顶部
        .information-top{
            display: flex;
            width: 100%;
            height: 48px;
            font-size: 14px;
            align-items: center;
            justify-content: center;
            background: #F7FCFF;
            border-radius: 0 4px 4px 0;
        }

        // 中部
        .information-middle{
            width: 98%;
            height: 83%;
            background-color: #f1f1f1;
            border-radius: 5px;

            // 群聊邀请
            .invite-friend-form{
                cursor: pointer;
                display: flex;
                width: 85%;
                height: 60px;
                background-color: #c3c3c3;
                margin-left: 60px;
                align-items: center;
                justify-content: space-evenly;
                margin-bottom: 5px;
                border-radius: 5px;

                .invite-friend-form-avatar{
                    width: 45px;
                    height: 45px;
                    margin-right: 20px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .invite-friend-form-item{
                    text-align: left;
                    font-weight: bold;
                    font-family: "Alimama DongFangDaKai" , serif;
                    font-size: 12px;
                }
                .invite-friend-add-Person{
                    margin-left: 90px;
                }
            }
            .invite-friend-form:hover{
                background: #9f9f9f;
            }

            // 添加好友
            .single-object{
                cursor: pointer;
                display: flex;
                width: 85%;
                height: 60px;
                background-color: #c3c3c3;
                margin-left: 60px;
                align-items: center;
                justify-content: space-evenly;
                margin-bottom: 5px;
                border-radius: 5px;

                // 头像
                .add-avatar-form{
                    width: 45px;
                    height: 45px;
                    margin-right: 20px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                // 昵称和谚语
                .form-form{
                    text-align: left;
                    font-weight: bold;
                    font-family: "Alimama DongFangDaKai" , serif;
                    font-size: 12px;
                }
                
                // 添加按钮
                .add-Person{
                    margin-left: 90px;
                }
            }
            .single-object:hover{
                background: #9f9f9f;
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


<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

</style>