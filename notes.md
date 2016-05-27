# Notes for implementing a Javascript CRUD interface with Wordpress #
We are trying to maintain a generic implementation.  Using a JSON string as the data packet offers two-fold benefits: it can hold any data, and simple to copy without dealing with deep cloning of objects.

CB - callback function
onS - on Success
onE - on Error
ctrl - Controller
mdl - Model
SS - Storage Service

NOTES: There will be ID and post_ID.  Post_ID will also be in the JSON package.  Most of the time they would be equal, but they could be separated.
Not sure if separation of mdl and SS is necessary, yet.
Should Controller send a unique transaction ID down the chain so a log can be created to record steps in transaction or create a journal.

Code to generate pseudo-unique id
~~~
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
~~~
OR
```
_.uniqueID(prefix)
```
```
Model element data = {
	ID : id goes here,
	data : { } ,
	state: 'uploaded', 'error', 'uploading', etc
	}

Model.data = an array of model element data

StorageService data = {
	ID : id goes here,
	data : JSON string,
	state: 'uploaded', etc
}

ERRORS 

```  



## CREATE ##

Model has a NewE object the data-binding is set on so it contains new entry

  1. Controller Add to Model with ctrlCBonS and ctrlCBonE
  2. Model sends JSON.stringify of New Entry with mdlCBonS and mdlCBonE to StorageService
  3. StorageService ajax request to 'create_action' url with SSCBonS and SSCBonE.
    * on success SSCBonS is called
	  1. A new object with returned ID, JSON of New Entry, and state of 'uploaded' is pushed to SS collection
	  2. (could we have SS push new object directly to Model?)
	  3. mdlCBonS is called with new object
	    1. JSON.parse new object data and push to model collection
		2. Clear NewE object
		3. ctrlCBonS is called with new ID
	* on error SSCBonE is called
	  1. push error to SS error object
	  2. mdlCBons is called with clone of error object
	    1. error added to error object
		2. ctrlCBonE is called with error object - since async may not want ctrl to access error thru model

		
## READ ##
		
  getAll()
  get(id)
  get([id1,id2,id3,id4])
  get(page, posts_per_page)
  findByTitle('ipsum')
  findByAuthor('bob')
  showAll
  show(id)
  show([id1,id2,id3,id4])
  show(page, posts_per_page)
  
  model.show* - these will bring down a subset of StorageService's collection
  SS.get* - these will send ajax request to obtain a new collection
  model.showAll(b) - copy all of SS collection into model.  If b is true, run getAll() and copy into SS and model
  model.show(id) - find id in SS collection, if not found, get(id) called, if found added to SS and model
  
## UPDATE ##

Controller is called with ID of data to change

  1. Controller Update to Model with ID, ctrlCBonS, and ctrlCBonE
  2. Model finds entry with ID (async?) JSON.stringify data, state changed to 'saving'
  3. Model sends ID and JSON string to StorageService with mdlCBonS and mdlCBonE
  4. StorageService finds ID
  5. JSON.parse SS and model versions, run _.isEqual
    * if equal
	  * if state is 'saved'
	    1. call mdlCBonS with state
		2. mdlCBonS updates state
		3. ctrlCBonS is called
	* else
	  1. state is changed to 'saving'
	  2. StorageService sends ajax request to 'update_action' with SSCBonS and SSCBonE
	  * on success SSCBonS is called
	    1. state is changed to saved
		2. mdlCBonS is called with state
		  1. state of model is changed to state
		  2. ctlCBonS is called with state
	  * on error SSCBonE is called
	    1. state is changed to 'notSaved'
		2. mdlCBonE is called with state
		  1. state of model is changed to state
		  2. ctlCBonS is called with state

		  
	  
> Ok, after going through all the possible READ methods, getting overwhelmed.  These are things that can be implemented later if needed.  For now, let's leave the above info/data/notes but continue on with a more abridged solution. 

### Beginning Basic Storage Service API ###
```javascript
SS = {
	create(id, data,[CBonS, CBonE]),
	read(CBonS, CBonE),                // data passed to CBonS
	update(id, data, [CBonS, CBonE]),
	delete(id, [CBonS, CBonE])
	}
```

No data returned by these functions as they are asynchronous.  Data passed to callbacks, CB.  Above we were looking at SS having a collection.  Let's simplify..only model now.  An SS collection would act like a cache.  Let's look/implement at it in that way, later.

## CREATE ##
SS.create

Model has a NewE object the data-binding is set on so it contains new entry

  1. Controller Add to Model with ctrlCBonS and ctrlCBonE
  2. Model sends JSON.stringify of New Entry with mdlCBonS and mdlCBonE to SS.create
  3. StorageService ajax request to 'create_action' url with SSCBonS and SSCBonE.
    * on success SSCBonS is called
	  1. A new object with returned ID, JSON of New Entry, and state of 'saved' is created
	  3. mdlCBonS is called with new object
	    1. JSON.parse new object data and push to model collection
		3. ctrlCBonS is called with new ID
	* on error SSCBonE is called with error
	  2. mdlCBons is called with error object - maybe as JSON
	    1. maybe----error added to error object
		2. ctrlCBonE is called with error object - since async may not want ctrl to access error thru model

## READ ##
SS.read

Either through controller or part of initialization of app, read is called.
  1. Controller or init calls model.read() with ctrlCBonS and ctrlCBonE
  2. Model.read calls SS.read with mdlCBonS and mdlCBonE
  3. StorageService ajax request to 'read_action' url with SSCBonS and SSCBonE
     * on success SSCBonS is called with data
	   1. a JSON array is returned.
	   2. An array of objects is created. For each element in the JSON array an object like SS data object above is created.  data property on object is still in JSON format. state is set to 'saved' for each.
	   3. This new array of objects is passed to mdlCBonS
		 1. mdlCBonS goes through and JSON.parse the data property
		 2. Model's data is set to this array of objects
		 3. mdlCBonS calls ctrlCBonS
	* on error SSCBonE is called with error
	  2. mdlCBons is called with error object - maybe as JSON
	    1. maybe----error added to error object
		2. ctrlCBonE is called with error object - since async may not want ctrl to access error thru model

On PHP side. Send only ID and any field that is needed..not to include the minutia of fields especially since unsure how the conversions from JSON and back might affect the fields..esp. dates.

http://stackoverflow.com/questions/4662641/how-do-i-verify-jquery-ajax-events-with-jasmine

 * When SS.read is called with mdlCBonS and mdlCBonE and it is a success:
    * SSCBonS is called. jasmine.spy
	* a JSON array is returned
	* an array of objects is created
	  * the array is same size as returned JSON array
	  * _.filter(array, function(obj){ return obj.state === 'saved' } ).length = original array length
	  * _.filter(array, function(obj){return typeof obj.ID === 'number'} ).length = original array length
	  * newArray = _.pluck(new, 'id), _.uniq(newArray).length === original array length
	  * 
	  
	  
	  
## UPDATE ##
SS.update

Controller is called with ID of data to change.  

  1. Controller Update to Model with ID, ctrlCBonS, and ctrlCBonE
  2. Model finds entry with ID, JSON.stringify data, state changed to 'saving'
  2. Model element data object in closure so accessed by CB's
  3. Model sends ID and JSON string to StorageService with mdlCBonS and mdlCBonE
  2. StorageService sends ajax request to 'update_action' with SSCBonS and SSCBonE
	  * on success SSCBonS is called with result
		2. mdlCBonS is called with state
		  1. state of model is changed to state, 'saved'
		  2. ctlCBonS is called with state
	  * on error SSCBonE is called
		2. mdlCBonE is called with state
		  1. state of model is changed to state, 'notSaved'
		  2. ctlCBonS is called with state
		  
On PHP side wp_update_post( $post, $wp_error ); is called where $post is an associative array with 'ID', and any fields that are changing.  We will use JSON.decode($string, true), true tells it to return an associative array.
	
## DELETE##
SS.delete

  1. Controller Delete model with ID, ctrlCBonS, and ctrlCBonE
  2. Model delete finds entry with ID, state changes to 'deleting' (_.find)
  3. Model sends ID to SS with mdlCBonS and mdlCBonE
  4. StorageService sends ajax request to 'delete_action' with SSCBonS and SSCBonE
    * on success SSCBonS is called with result
	  1. mdlCBonS is called with state
	    1.  model = _.filter(model, function(e){return e.ID !== ID});
    * on error SSCBonE is called with result
      * if result === 'postID not found'
           mdlCBonS is called with state
		     1. see above - ID is removed from model
      * else
           mdlCBonE is called with 'unableToDelete'
		     1. state is changed
			 

On PHP side wp_delete_post( $postID, $force_delete ) is called.  Returns $post if success or false if failure. Look at whether we should bypass trash

> To make this a WordPress Plugin, the PHP portion can be generic with a Filter hook to determine post_type and fields to be in JSON package.  Defaulting to 'post' and fields: title, content, author, 

