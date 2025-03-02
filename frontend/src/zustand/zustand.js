import {create} from "zustand"; 
// call a api to get user data
const fetchUser = async () => {
    try{
      const res =  fetch("http://localhost:5000/api/users"); 
      const data = await res.json();
     return data; 
    }catch(e){
       console.log(err);
       return null;
    }
}

const useStore = create((set) => ({
    users: null,
    fetchUser: async () => {
        const data = await fetchUser();
        set({users: data});
    }
}))
export default useStore;