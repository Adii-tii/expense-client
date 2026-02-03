#React 
js framework
virutual dom
single page application
component designing 


evry component should return an HTML code.
it should return exaclty one root node.
we export default because the file type is module


1. prop passing
2. use state
3. lists
4. conditional rendering


react-router-dom: keeps track of the state, changes/swaps in out content correspoding to the url.
cors :origin of req and res is difference. the browser blocks the req and tries to verfiy with the server whether or not the req domain is whitelisted. the condigurations should be done on the server side.

for two components to communuicate one comp should create a function pass to the other comp /lifting the state up 

!always delete cookies in handleLogout functionality because the browser can sometimes cache the jwtToken.

# React Redux : 
global state management
1. providers : responsible for making all the values in the store available to the entire application
2. store : all objects and values are stored in the store
3. reducers : functions which accept action and payload (ie new data) and old data to return a new value.
4. action : (dispatch) used when you want to signal changes in the value of the object in the store. you pass in action (ie type) and new value (payload)

steps:
1. call dispatch with action(Type) and the new value (payload)
2. dispatch informs store which in turn calls all the reducers that are registered in the store.
3. all reducers process the event and return updated value.
4. store then updates the value and informs the provider
5. provider will inform all useSeleectors about the new value and each useSelector will take action of re render if needed
