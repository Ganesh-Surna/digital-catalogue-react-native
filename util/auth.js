import AsyncStorage from "@react-native-async-storage/async-storage";

export function getPermissionsObj() {
  const permissionsObj = JSON.parse(AsyncStorage.getItem("PERMISSIONS"));

  if (!permissionsObj) {
    return null;
  }
  return permissionsObj;
}

export function getUserId() {
  const userId = JSON.parse(localStorage.getItem("USER_ID"));

  if (!userId) {
    return null;
  }
  return userId;
}

export async function getAccountLoader() {
  const account = await AsyncStorage.getItem("ACCOUNT");

  if (!account) {
    return null;
  }
  console.log("account data loaded in auth.js:", account);
  console.log("account type is", typeof account);
  return JSON.parse(account);
}

export function authTokenLoader() {
  const token = localStorage.getItem("TOKEN");
  if (!token) {
    return null;
  }
  return token;
}

// export function checkAuthLoader() {
//   const token = authTokenLoader();

//   if (!token) {
//     return redirect("/auth?mode=login");
//   }

//   return null;
// }

// export function checkRetailerAuthLoader() {
//   const token = authTokenLoader();
//   const account = getAccountLoader();
//   // console.log(account.accountType);

//   if (!token) {
//     console.log("no auth token");
//     return redirect("/auth?mode=login");
//   } else if (
//     account.accountType === "Manufacturer" ||
//     account.accountType === "system"
//   ) {
//     return redirect("/");
//   }

//   return null;
// }

// export function checkManufacturerAuthLoader(featureKey) {
//   const { accountIds, features } = getPermissionsObj();
//   const token = authTokenLoader();
//   const account = getAccountLoader();
//   // console.log(account.accountType);

//   if (!token || !account) {
//     console.log("no auth token");
//     return redirect("/auth?mode=login");
//   } else if (
//     account.accountType === "Retailer" ||
//     account.accountType === "system" ||
//     (account.accountType === "Manufacturer" && accountIds.includes(account.id) && !features[featureKey].view)
//   ) {
//     return redirect("/");
//   } else {
//     return null;
//   }
// }

// export function checkCommonFeatureAuthLoader(featureKey) {
//   const { accountIds, features } = getPermissionsObj();
//   const token = authTokenLoader();
//   const account = getAccountLoader();
//   // console.log(account.accountType);

//   if (!token || !account) {
//     console.log("no auth token");
//     return redirect("/auth?mode=login");
//   } else if (
//     (account.accountType === "Manufacturer" && accountIds.includes(account.id) && !features[featureKey].view)
//   ) {
//     return redirect("/");
//   } else {
//     return null;
//   }
// }

// export function checkSystemAuthLoader() {
//   const token = authTokenLoader();
//   const account = getAccountLoader();
//   // console.log(account.accountType);

//   if (!token || !account) {
//     console.log("no auth token");
//     return redirect("/auth?mode=login");
//   } else if (
//     account.accountType === "Retailer" ||
//     account.accountType === "Manufacturer"
//   ) {
//     return redirect("/");
//   } else {
//     return null;
//   }
// }