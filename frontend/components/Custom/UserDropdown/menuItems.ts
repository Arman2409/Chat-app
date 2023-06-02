export const getItems = (isBlocked:boolean, isRequested:boolean) =>  ({
   all: [
     ...(!isRequested ? [ {
      key: 'addFriend',
      label: "Add Friend",
    }] : []),
    {
      key: isBlocked ? 'unBlockUser' : 'blockUser',
      label: isBlocked ? "Unblock User" : "Block User",
    },
   ],
   friends: [
    {
      key: 'removeFriend',
      label: "Remove Friend",
    }
   ],
});