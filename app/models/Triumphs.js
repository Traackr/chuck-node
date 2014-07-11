/**
 * Triumphs.js 
 * Traackr: chuck node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * Triumph Mongoose Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ChuckUtils = require('../lib/ChuckUtils')

/**
 * Custom Getters
 * 
 * This custom method will be set in the schema definition, for when the property is accessed
 * @example of a Mongoose Schema custom getter @see schema definition below
 */
var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Custom Setters
 *
 * These custom methods will be set in the schema definition, for when the property is set
* @example of a Mongoose Schema custom setter @see schema definition below
 */
var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Triumph Schema
 *
 * Schema definitions are where you can set up your 
 * fields, types, defaults, and other settings
 * @example of a schema definition.  Note, custom getters and stters, minimums, and defaults
 */
var TriumphSchema = new Schema({
  text: {type : String, default : '', trim : true},
  textHash: { type : String, trim : true },
  tags: {type: [], get: getTags, set: setTags },
  likes: {type: Number, default : 0, min : 0 },
  dislikes  : { type : Number, default : 0, min : 0 }
})

/**
 * Virtuals
 *
 * Virtuals are fields that are not persisted but are dynamically generating values.
 * @example of mongoose virtuals (Non-persisted fields)
 */
TriumphSchema.virtual('score').get(function () {
  return this.likes - this.dislikes;
});
TriumphSchema.virtual('created').get(function () {
  return this._id.getTimestamp();
});

/**
 * Validations
 *
 * @example of Schema built in validations
 */
TriumphSchema.path('text').validate(function (text) {
  return text.length > 4
}, 'Text cannot be less than 5 characters.  Chuck can do better than that.')

/**
 * Pre-save hook
 * You can check here if a triumph exists before saving
 *
 * @example of a pre-save hook
 */
TriumphSchema.pre('save', function(next) {
  var self = this
  // Check for existence
  if (!ChuckUtils.exists(this.text))
    return next(new Error('Text required')) 
  
  // Hash Text into a hash for quick lookup if exists...
  self.textHash = ChuckUtils.hashText(self.text)  
  if (!this.isNew) {
    return next() 
  }
  else {
    // If new, look up by hash to see if text exists
    // @example of an exists check before a save
    mongoose.models['Triumph'].findOne({ textHash : self.textHash }, function(err,result) {
      if (err) {
        next(err)
      } else if (result) {
        next(new Error('Triumph exists')) 
      } else {
        next();
      }
    })
  }
})


/*
 * Methods
 * 
 * Methods are functions that run on the instance of the schema returned 
 * @example of instance methods
 */
TriumphSchema.methods = {

   /**
    * Increments the value of the given field
    *
    * @param {String} field
    * @param {Function} cb
    */
   rate: function(field, cb) {
    if (field != 'likes' && field != 'dislikes') {
      return cb(new Error('must be likes or dislikes'), null)
    }
    var self = this;
    var updateQuery = {};
    updateQuery.$inc = {}
    updateQuery.$inc[field] = 1;
    this.update(updateQuery, { w : 1 }, function(err,x) {
      cb(err, null);
    })
  }  
}

/**
 * Statics
 * 
 * Statics are like methods, except they are for defining functions that exist and can operate
 * directly on the Model
 *
 * @example of schema static methods that encapsulate mongoose api db functions
 */
TriumphSchema.statics = {

  /**
   * Find Triumph by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   */
  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },

  /**
   * Paginated list function
   *
   * @param {ObjectId} options
   * @param {Function} cb   
   *
   * @example of skip/limit for pagination
   */
  list: function (options, cb) {
    var criteria = options.criteria || {}
    this.find(criteria)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

mongoose.model('Triumph', TriumphSchema)
