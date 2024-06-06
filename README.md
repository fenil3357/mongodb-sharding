# MONGODB SHARDING

## Overview

A simple demo to understand and implement how sharding in mongodb works on local database.

To implement sharding in mongodb we need to create multiple shard servers and a config server which will work as a query router for our database.

## Implementation

1) First stop all the mongodb instances running on your machine.

2) Then start multiple shard servers each with a replica set.



```
mongod --port 27020 --dbpath <YOUR_DATA_PATH_TO_SHARD1_DIRECTORY> --shardsvr --replSet rs1
mongod --port 27021 --dbpath <YOUR_DATA_PATH_TO_SHARD2_DIRECTORY> --shardsvr --replSet rs2
mongod --port 27022 --dbpath <YOUR_DATA_PATH_TO_SHARD2_DIRECTORY> --shardsvr --replSet rs3
```

example data path : "C:\data\shard1"

3) Connect with each shard and initialize the replica sets of shard servers

```
mongosh --port 27020
rs.initiate({_id: "rs1", members: [{_id: 0, host: "localhost:27020"}]})

mongosh --port 27021
rs.initiate({_id: "rs2", members: [{_id: 0, host: "localhost:27021"}]})

mongosh --port 27022
rs.initiate({_id: "rs3", members: [{_id: 0, host: "localhost:27022"}]})
```

4) Start a config server

```
mongod --configsvr --port 27019 --dbpath <YOUR_DATA_PATH_TO_CONFIG_DIRECTORY> --replSet configReplSet
```

5) Connect with config server and initialize the replica set

```
mongosh --port 27019

rs.initiate({_id: "configReplSet", members: [{_id: 0, host: "localhost:27019"}]})
```

6) Start a mongos instance and connect it with the config server, which will work as a query router

```
mongos --configdb configReplSet/localhost:27019
```

7) Start your main mongodb instance on port 27017

8) Connect with that instance and add the shards

```
mongosh --port 27017

sh.addShard("rs1/localhost:27020")
sh.addShard("rs2/localhost:27021")
sh.addShard("rs3/localhost:27022")
```

9) Verify the shards

```
sh.status()
```

10) Create a database and enable sharding

```
use sharding-test
sh.enableSharding("sharding-test")
```
11) Create a new collection and create an index on shardKey

```
db.createCollection("documents");
db.documents.createIndex({ shardKey: 1 })
```

12) Shard the collection using shardKey

```
sh.shardCollection("sharding-test.documents", { shardKey: 1 })
```

13) Verify the sharding of collection and balancer state

```
db.documents.getShardDistribution()

sh.getBalancerState()  // Check if balancer is enabled
sh.setBalancerState(true)  // Enable balancer if it is not already enabled
sh.startBalancer()  // Start the balancer
```

14) Now download the dependencies of the node application and start the node app to insert some data using mongoose (use port 27017 in MONGO_URI).

The node app will automatically create new 100 documents with shard keys.

```
npm install
node app.js
```

15) Manually split the chunks

```
use sharding-test

sh.splitAt("myDatabase.documents", { shardKey: 25 })
sh.splitAt("myDatabase.documents", { shardKey: 50 })
sh.splitAt("myDatabase.documents", { shardKey: 75 })
```

16) Verify the distribution of data.

```
db.documents.getShardDistribution()
```