var _ = require('underscore'),
    walk = require('walk').walk,
    fs = require('fs');

var DEFAULT_NAMESPACE = 'JST';
var DEFAULT_COMPILER = '_.template';
var DEFAULT_EXTENSION = 'jst';

module.exports = function stitchit(o,callback){
 var compiler = new TemplateCompiler(o);
 return compiler.compile(callback);
};

var TemplateCompiler = function(o){
  if(_.isString(o)) o = {path: o};
  this.path = o.path;
  this.namespace = o.namespace || DEFAULT_NAMESPACE;
  this.compiler = o.compiler || DEFAULT_COMPILER;
  this.extension = '.' + (o.extension || DEFAULT_EXTENSION);
  this.extension_matcher = RegExp('\\'+this.extension+'$');
  this.templates = "var "+this.namespace+" = "+this.namespace+" || {};\n";
};

_.extend(TemplateCompiler.prototype,{
  
  compile: function(cb){
    var tc = this;
     
    var onComplete = function(err){
      if(err) return cb(err);
      cb(null,tc.getTemplates());
    };

    fs.stat(this.path,function(err,stat){
      if(err){
        cb(err);
      } else if(stat.isFile()){
        tc.readTemplateFile(tc.path,onComplete);
      } else if(stat.isDirectory()){ 
        tc.readTemplateDirectory(tc.path,onComplete);
      } else {
        cb(new Error( tc.path+' is neither a file nor a directory'));
      }
    });

    return this;
  },

  readTemplateDirectory: function(path,cb){
    var tc = this;
    this.walker = walk(this.path);

    this.walker.on('file', function(root, stat, next){
      if(!tc.isTemplateFile(stat.name)) return next();
      tc.readTemplateFile(root+stat.name,next);
    });
    
    this.walker.on('end', function(){
      cb(null);
    });
  },
  
  readTemplateFile: function(path, cb){
    var tc = this;
    var name = path.split('/').pop().split('.')[0];
    fs.readFile(path,'utf8',function(err,data){
      if(err) return cb(err);
      tc.addTemplate(name,data);
      cb(null);
    });
  },
  
  isTemplateFile: function(path){
    return this.extension_matcher.test(path);
  },

  addTemplate: function(name,template){
    this.templates += "JST['"+name+"'] = _.template("+JSON.stringify(template)+");\n";
  },

  getTemplates: function(){
    return this.templates;
  }
});
