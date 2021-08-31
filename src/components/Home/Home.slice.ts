import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { listAll, ref, uploadBytes } from "firebase/storage";
import { fireStore, storage } from "../../config/firebase";

interface HomeState {
  pictures: string[];
}

const initialState: HomeState = {
  pictures: [],
};

export const getPictureAsyncAction = createAsyncThunk(
  "Home/GetPicture",
  async (params) => {
    const querySnapshot = await getDocs(collection(fireStore, "pictures"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
    const imageRef = ref(storage, "images");

    // Find all the prefixes and items.
    listAll(imageRef)
      .then((res) => {
        res.prefixes.forEach((folderRef, index) => {
          console.log(`folder ${index}`, folderRef);
        });
        res.items.forEach((itemRef, index) => {
          console.log(`item ${index}`, itemRef.fullPath);
        });
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    return;
  },
);

export const addPictureAsyncAction = createAsyncThunk(
  "Home/AddPicture",
  async (params: File | undefined) => {
    await addDoc(collection(fireStore, "pictures"), {
      name: "pic1",
      url: "pic1.png",
    });
    if (params) {
      const imageRef = ref(storage, "images/upload.jpg");
      const value = await uploadBytes(imageRef, params);
      console.log(value);
    }
    return;
  },
);

const HomeSlice = createSlice({
  name: "Home",
  initialState,
  reducers: {
    setHomeState: (state, action: PayloadAction<Partial<HomeState>>) => {
      return { ...state, ...action.payload };
    },
    resetHomeState: () => {
      return initialState;
    },
  },
  extraReducers: {
    [getPictureAsyncAction.pending.toString()]: (state) => {},
    [getPictureAsyncAction.fulfilled.toString()]: (state) => {},
    [getPictureAsyncAction.rejected.toString()]: (state, action) => {},

    [addPictureAsyncAction.pending.toString()]: (state) => {},
    [addPictureAsyncAction.fulfilled.toString()]: (state) => {},
    [addPictureAsyncAction.rejected.toString()]: (state, action) => {
      console.log(action.error);
    },
  },
});

export const { setHomeState, resetHomeState } = HomeSlice.actions;
export default HomeSlice.reducer;
