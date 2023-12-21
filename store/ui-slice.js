import { createSlice } from "@reduxjs/toolkit";

const initialUiState = {
  isDrawerOpen: false,
  isDesignDetailsOpen: false,
  isCatalogueDesignDetailsOpen: false,
  selectedFilters: [],
  filters: {
    "mainGrpFilter": false,
    "categoryFilter": false,
    "productFilter": false,
    "moreFilter": false,
    "styleFilter": false,
    "designFilter": false,
    "wtFilter": false,
  },
};

const uiSlice = createSlice({
  initialState: initialUiState,
  name: "ui",
  reducers: {
    toggleDashboard(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    expandFilter(state, action){
        const field=action.payload;
        
        for(let key in state.filters){
            if(key===field){
                state.filters[field]=!state.filters[field];
            }
            else{
                state.filters[key]=false;
            }
        }
    },
    closeFilters(state){
        for(let key in state.filters){
                state.filters[key]=false;
        }
    },
    selectFilter(state, action){
        const {label, id, event, setFn}= action.payload;
        let existingItem= state.selectedFilters.find((item)=>{
            return item.id===id;
        });
        let existingItemIndex= state.selectedFilters.findIndex((item)=>{
            return item.id===id;
        });
        if(existingItem){
            state.selectedFilters.splice(existingItemIndex,1);
        }
        else{
            state.selectedFilters.unshift({label, id, event, setFn});
        }
    },
    removeFilter(state, action){
        const id= action.payload;
        let existingItemIndex= state.selectedFilters.findIndex((item)=>{
            return item.id===id;
        });
        state.selectedFilters.splice(existingItemIndex,1);
    },
    clearFilters(state){
        state.selectedFilters=[];
    },
    openDesignDetails(state){
        state.isDrawerOpen= true;
    },
    closeDesignDetails(state){
        state.isDrawerOpen= false;
    },
    openCatalogueDesignDetails(state){
        state.isCatalogueDesignDetailsOpen= true;
    },
    closeCatalogueDesignDetails(state){
        state.isCatalogueDesignDetailsOpen= false;
    },
  }
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;