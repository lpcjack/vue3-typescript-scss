// 存数据
const KEY = 'PINIA:STATE';
export function store (userId: any, friendListInfo: any, personalGrouplist: any){
    window.addEventListener('beforeunload', () => {
        const data = {
            userId: userId,
            friendsListInfo: friendListInfo,
            personalGroupDisplay: personalGrouplist,
        }
        localStorage.setItem(userId + KEY, JSON.stringify(data))
    });
}

// 取数据
export function getData (userId: any){
    try {
        const data = localStorage.getItem(userId + KEY)
        if(data != null){
            const Data = JSON.parse(data)
            if(Data){
                // 将数据放入user.ts里的state数据中
                return Data
            }
        }
        else {
            console.log("数据有问题！！！")
        }
    }
    catch{
        console.log("数据有问题！！！")
    }
}

export function test(userId: string){
    const data = {
        testData: "这是一个测试数据",
        id: userId,
    }
    localStorage.setItem(KEY+'1', JSON.stringify(data))
}