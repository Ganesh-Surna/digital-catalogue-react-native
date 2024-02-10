import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import { getUser } from '../../util/auth';

const UserInfo = () => {

  const [user, setUser]= useState();

  useEffect(()=>{
    getUser()
      .then((response) => {
        setUser(response);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  },[getUser])

  //console.log(user.roleSet[0].role)

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../assets/download.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user && user.firstName} {user && user.lastName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{user && user.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Address:</Text>
        <Text style={styles.infoValue}>{user && user.address}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Roles:</Text>
        <Text style={styles.infoValue}>{user && user.roleSet[0].role}</Text>
        {/* {user && user.roleSet && user.roleSet.map((role)=>(
          <Text style={styles.infoValue}>{role.role}</Text>
        ))} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#6a4887'
  },
  infoContainer: {
    marginTop: 30,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 18,
    marginTop: 5,
  },
});

export default UserInfo