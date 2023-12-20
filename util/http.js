import { QueryClient } from "@tanstack/react-query";

export const queryClientObj = new QueryClient();

export async function login(formData){
    const response = await fetch('http://192.168.31.161:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        // body: formData,
    });
    
    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to login");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of login FAILED: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data of login: ", resData);
    return resData;
}

export async function fetchAllDesigns(){
    const response = await fetch('http://192.168.31.161:8080/api/designs');
    
    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to load all designs");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of all designs FAILED: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data of all designs: ", resData);
    return resData;
}

export async function fetchCatalogueDesigns({accountId, signal}){
    const response = await fetch(`http://192.168.31.161:8080/api/designs/filters?designs=assigned&accountId=${accountId}`, {signal: signal});

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to load catalogue designs");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of all catalogue designs FAILED: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data of all catalogue designs: ", resData);
    return resData;
}

export async function fetchAssignedRetailers({cardItemId, signal}){
    const response = await fetch(`http://192.168.31.161:8080/api/design-account/${cardItemId}/accounts`, {signal: signal});

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to load assigned retailers");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of assigned retailers for particular design FAILED: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data of assigned retailers for particular design: ", resData);
    return resData;
  }

  
  export async function updateDesignFields({cardItemId, updatedData}){
    const response = await fetch(`http://192.168.31.161:8080/api/designs/${cardItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",  
      },
      body: JSON.stringify(updatedData),
    });

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to  update design fields");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to  update design fields: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data of update design fields ", resData);
    return resData;
  }


  export async function addDesignSet({cardItemId, addedData}){
    const response = await fetch(`http://192.168.31.161:8080/api/designs/${cardItemId}/details`,
        {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(addedData),
        });

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to add design set");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to add design set: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data of add design set: ", resData);
    return resData;
  }


  export async function updateDesignSet({cardItemId, updatedData, detailsId}){
     const response = await fetch(`http://192.168.31.161:8080/api/designs/${cardItemId}/details/${detailsId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to update design set");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to update design set: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data of update design set: ", resData);
    return resData;
  }


  export async function assignRetailer({cardItemId, formattedData, edit, prevRetailerId, designAccountId}){
    let url = `http://192.168.31.161:8080/api/design-account`;
    let method = "POST";

    if(edit){
        // url = `http://localhost:8080/api/design-account/accounts/${prevRetailerId}/designs/${cardItemId}`;
        url = `http://192.168.31.161:8080/api/design-account/${designAccountId}`;

        method = "PUT";
    }

    const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",  
        },
        body: JSON.stringify(formattedData),
      });

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to add design set");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of assigned retailers for particular design FAILED: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data of add design set: ", resData);
    return resData;
  }


  export async function removeRetailer(retailerId){
    const response = await fetch(
      `http://192.168.31.161:8080/api/design-account/${retailerId}`,
      {
        method: "DELETE",
      }
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to remove assigned retailer");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to remove assigned retailer: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data remove assigned retailer: ", resData);
    return resData;
  }


  export async function accountLogin(retailerId){
    const response = await fetch(
      `http://192.168.31.161:8080/api/login`,
      {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      }
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to remove assigned retailer");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to remove assigned retailer: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data remove assigned retailer: ", resData);
    return resData;
  }

  export async function fetchAccounts(){
    const response = await fetch(
      `http://192.168.31.161:8080/api/accounts`
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch accounts");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch accounts: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data fetch accounts: ", resData);
    return resData;
  }

  export async function fetchAssignedDesigns(){
    const response = await fetch(
      `http://192.168.31.161:8080/api/design-account`
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch assigned designs");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch assigned designs: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data fetch assigned designs: ", resData);
    return resData;
  }



  export async function postOrder(data){
    const response = await fetch(
      `http://192.168.31.161:8080/api/orders`,
      {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to post order");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to post order: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data post order: ", resData);
    return resData;
  }

  export async function fetchOrders({signal, userId}){
    const response = await fetch(
      `http://192.168.31.161:8080/api/orders/user/${userId}/orders`,{signal}
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch order");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch order: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch order: ", resData);
    return resData;
  }

  export async function fetchRecentOrders({signal,max}){
    const response = await fetch(
      `http://192.168.31.161:8080/api/orders/?pageSize=${max}`,{signal}
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch recent order");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch recent order: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch recent order: ", resData);
    return resData;
  }

  export async function fetchOrdersForManufacturer(){
    const response = await fetch(
      `http://192.168.31.161:8080/api/orders`
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch order for manufacturer");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch order for manufacturer: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch order for manufacturer: ", resData);
    return resData;
  }

  export async function deleteOrder({orderId, orderItemId}){
    const response = await fetch(
      `http://192.168.31.161:8080/api/orders/${orderId}/orderItem/${orderItemId}`,{
        method: "DELETE",
      }
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to delete order");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to delete order: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data delete order: ", resData);
    return resData;
  }

  export async function updateOrder({orderId, orderItemId, data}){
    const response = await fetch(
      `http://192.168.31.161:8080/api/orders/${orderId}/orderItem/${orderItemId}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to update order");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to update order: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data update order: ", resData);
    return resData;
  }

  export async function fetchCart({signal, userId}){
    const response = await fetch(
      `http://192.168.31.161:8080/api/carts/user/${userId}/cart`,{signal}
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch cart");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch cart: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch cart: ", resData);
    return resData;
  }

  export async function postCart(data){
    const response = await fetch(
      `http://192.168.31.161:8080/api/carts`,
      {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to post cart");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to post cart: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data post cart: ", resData);
    return resData;
  }

  export async function deleteCart({cartId, cartItemId}){
    const response = await fetch(
      `http://192.168.31.161:8080/api/carts/${cartId}/cartItem/${cartItemId}`,{
        method: "DELETE",
      }
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to delete cart");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to delete cart: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data delete cart: ", resData);
    return resData;
  }

  export async function updateCart({cartId, cartItemId, data}){
    const response = await fetch(
      `http://192.168.31.161:8080/api/carts/${cartId}/cartItem/${cartItemId}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to update cart");
        error.code = response.status;
        const resData = await response.json();
        // console.log("res data of Failed to update cart: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    console.log("res data update cart: ", resData);
    return resData;
  }

  export async function fetchAssignedDesignsForManufacturer(){
    const response = await fetch(
      `http://192.168.31.161:8080/api/designs/filters?designs=assigned`
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch Assigned Designs for manufacturer");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch Assigned Designs for manufacturer: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch Assigned Designs for manufacturer: ", resData);
    return resData;
  }

  export async function fetchAccountOrdersForManufacturer(){
    const response = await fetch(
      `http://192.168.31.161:8080/api/accounts/account-orders`
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch account orders for manufacturer");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch account orders for manufacturer: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch account orders for manufacturer: ", resData);
    return resData;
  }

  export async function fetchOrderedDesignsForUser({userId, signal}){
    const response = await fetch(
      `http://192.168.31.161:8080/api/orders/user/${userId}/designs`,{signal}
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch ordered designs for user");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch ordered designs for user: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch ordered designs for user: ", resData);
    return resData;
  }

  export async function fetchAssignedDesignsVsAccounts(){
    const response = await fetch(
      `http://192.168.31.161:8080/api/accounts/account-designs`
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch assigned designs Vs accounts");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch assigned designs Vs accounts: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch assigned designs Vs accounts: ", resData);
    return resData;
  }

  export async function fetchAccountsVsUsersForSystem(){
    const response = await fetch(
      `http://192.168.31.161:8080/api/accounts/account-users?accountType=manufacturer`
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch accounts vs users for system");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch accounts vs users for system: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch accounts vs users for system: ", resData);
    return resData;
  }

  export async function fetchAccountsForSystem(){
    const response = await fetch(
      `http://192.168.31.161:8080/api/accounts/filters/?accountType=manufacturer`
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch accounts for system");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch accounts for system: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch accounts for system: ", resData);
    return resData;
  }

  export async function fetchUsersForSystem(){
    const response = await fetch(
      `http://192.168.31.161:8080/api/users/filters?accountType=manufacturer`
    );

    if(!response.ok){
        console.log("response status: " + response.status);
        const error = new Error("Failed to fetch users for system");
        error.code = response.status;
        const resData = await response.json();
        console.log("res data of Failed to fetch users for system: ", resData);
        error.info = resData;
        throw error;
    }

    const resData = await response.json();
    // console.log("res data fetch users for system: ", resData);
    return resData;
  }

  


  