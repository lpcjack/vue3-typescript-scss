const KEY_PREFIX = 'PINIA:STATE';

export default function(context: any) {
    const { store } = context;

    // 存储
    window.addEventListener('beforeunload', () => {
        const partialState = {
            friendsListInfo: store.$state.friendsListInfo,
            personalGroupDisplay: store.$state.personalGroupDisplay,
        };
        localStorage.setItem(KEY_PREFIX + store.$id, JSON.stringify(partialState));
    });

    // 取回
    try {
        const stateString = localStorage.getItem(KEY_PREFIX + store.$id);
        if (stateString !== null) {
            const partialState = JSON.parse(stateString);
            console.log("取出的数据为："+partialState)
            if (partialState) {
                store.$patch(partialState);
            }
        }
    } catch {
        console.log("数据有问题！！");
    }
}
