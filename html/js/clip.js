/**
 * This reprensents the data store for clip. The intent was to make the 
 * ReactJS code a little cleaner/easier to manage. There are a lot of getters
 * and setters in here. This code manages the state of information and I 
 * allow the user to make a set of changes and either roll them back or 
 * persist those changes. We only call the backend when the user clicks save
 * or picks a new token to work on. Other than that, all calls are javascript
 * logic.
 */
var DU = DU || {};

DU.Clip = {
  teams: [],
  team: {},
};

DU.Clip = function() {
  this.data = {teams: [],
               team: {},
               selectedTeam: "",
               currentToken: -1,
               changeCount: 0,
               saveButtonVisibile: false,
               refreshFeatures: false,
               editApp: "",
               editFeature: "",
               sourceUrl: "/svc/clip/team"};
};

// setter
DU.Clip.prototype.setButtonVisible = function(value) {
  this.data.saveButtonVisibile = value;
};

// setter
DU.Clip.prototype.isButtonVisible = function() {
  this.data.saveButtonVisibile;
};

// store the team information
DU.Clip.prototype.setTeams = function(teams) {
  this.data.teams = teams.teams;
};

// pick a tem to display
DU.Clip.prototype.selectTeam = function(value) {
  this.data.selectedTeam = value;
  this.data.sourceUrl = "/svc/clip/team/" + value;
};

// getter
DU.Clip.prototype.selectedTeam = function() {
  return this.data.selectedTeam;
};

// getter
DU.Clip.prototype.isTeamSelected = function() {
  return this.data.selectedTeam.length > 0;
};

// setter
DU.Clip.prototype.setTeam = function(team) {
  this.data.team = team;  
};

// getter
DU.Clip.prototype.team = function () {
  return this.data.team;
};

// setter
DU.Clip.prototype.setTokens = function(tokens) {
  this.data.tokens = tokens;
};

// setter - populates the app names as well
DU.Clip.prototype.setToken = function(idx) {
  this.data.currentToken = idx;
  this.data.appNames = Object.keys(this.data.team.tokens[idx].apps);
};

// getter
DU.Clip.prototype.token = function() {
  if (undefined == this.data.currentToken)
    return -1;
  return this.data.currentToken;
};

// setter - we call this when a user starts to edit the app 
DU.Clip.prototype.setEditApp = function(app) {
  this.data.editApp = app;
};

// remove the fact that we're editing an app.
DU.Clip.prototype.clearEditApp = function(app) {
  delete this.data.editApp;
};

// getter - if the setter wasn't called we return an empty string
DU.Clip.prototype.editApp = function(app) {
  if (undefined != this.data.editApp) {
    return this.data.editApp;
  }
  return "";
};

// logic to delete an application. increment change count
DU.Clip.prototype.deleteApp = function(app) {
  if (undefined != this.data.team.tokens[this.data.currentToken].apps[app]) {
    delete this.data.team.tokens[this.data.currentToken].apps[app];
    this.data.appNames = Object.keys(this.data.team.tokens[this.data.currentToken].apps);
    this.incrChange();
  }
};

// logic to add an application and mark that we've been updated
DU.Clip.prototype.addApp = function() {
  var feat = {"attributes":{},"sbx":0,"dev":0,"stg":0,"int":0,"prd":0};      
  var d = new Date();
  var feats = this.data.team.tokens[this.data.currentToken].apps["New APP " + d.getTime()] = {};
  feats.features = {};
  feats["untitled " + d.getTime()] = feat;
  this.data.appNames = Object.keys(this.data.team.tokens[this.data.currentToken].apps);
  this.incrChange();
};

// setter
DU.Clip.prototype.setApps = function(val) {
  this.data.team.tokens[this.data.currentToken].apps = val;
};

// getter
DU.Clip.prototype.getApps = function() {
  return this.data.team.tokens[this.data.currentToken].apps;
};

// getter
DU.Clip.prototype.getAppNames = function() {
  return this.data.appNames;
};

// if we have an indicator to refreesh, remove the indicator and return true
DU.Clip.prototype.doRefresh = function() {
  if (undefined != this.data.refreshFeatures && this.data.refreshFeatures) {
    delete this.data.refreshFeatures;
    return true;
  }
  return false;
};

// setter
DU.Clip.prototype.setChangeCount = function(value) {
  this.data.changeCount = value;
};

// getter
DU.Clip.prototype.changeCount = function() {
  return this.data.changeCount;
};

// increse the change count
DU.Clip.prototype.incrChange = function() {
  this.data.changeCount++;
};

// reduce the change count
DU.Clip.prototype.decChange = function() {
  if (this.data.changeCount > 0)
    this.data.changeCount--;
};

// hold onto data so that we can undo
DU.Clip.prototype.stashRestore = function() {
  this.data.restoreData = this.data.team;
};

// getter
DU.Clip.prototype.hasRestore = function() {
  return (undefined == this.data.restoreData);
};

// getter
DU.Clip.prototype.getRestoreData = function() {
  if (undefined != this.data.restoreData)
    return this.data.restoreData;
  return {apps:{}};
};

/**
 * logic we need to do when we change an application name
 * because an app is part of the data structure, renaming isn't
 * trivial. 
 */  
DU.Clip.prototype.updateAppName = function(appname) {
  var apps = this.getApps();
  var keys = this.getAppNames();
  var what = keys.indexOf(this.editApp());
  var appd = apps[this.editApp()];
  this.setApps({apps:{}});
  this.clearEditApp();
  for (var idx = 0; idx < keys.length; ++idx) {
    if (idx == what) {
      this.data.team.tokens[this.data.currentToken].apps[appname] = appd;
      keys[idx] = appname;
      this.data.appNames = keys;
    } else {
      this.data.team.tokens[this.data.currentToken].apps[keys[idx]] = apps[keys[idx]];
    }
  }
  this.incrChange();
};

// add an attribute value to a app feature. app -> feature -> attrib = value
DU.Clip.prototype.addAttribute = function(app, feature, attrib, value) {
  this.data.team.tokens[this.data.currentToken].apps[app].features[feature].attributes[attrib] = value;
};

// remove an attribute
DU.Clip.prototype.deleteAttribute = function(app, feature, attrib, value) {
  delete this.data.team.tokens[this.data.currentToken].apps[app].features[feature].attributes[attrib];
  this.incrChange();
};

// some attribures can be flipped
DU.Clip.prototype.toggleAttribute = function(app, feature, attrib) {
  this.data.team.tokens[this.data.currentToken].apps[app].features[feature].attributes[attrib] =
    !(this.data.team.tokens[this.data.currentToken].apps[app].features[feature].attributes[attrib]);
};

// setter
DU.Clip.prototype.storeEditAttribute = function(value) {
  this.data.editAttrib = value;
};

// getter
DU.Clip.prototype.editAttribute = function() {
  if (undefined != this.data.editAttrib)
    return this.data.editAttrib;
  return "";
};

// logic to save an attribute
DU.Clip.prototype.saveAttribute = function(value, feature, app) {
  var feat = this.data.team.tokens[this.data.currentToken].apps[app].features[feature];
  var attr = feat.attributes;
  feat.attributes = {};
  var keys = Object.keys(attr);
  var what = keys.indexOf(this.data.editAttrib);
  var s = attr[this.data.editAttrib];
  for (var idx = 0; idx < keys.length; ++idx) {
    if ( idx == what ) {
      feat.attributes[value] = s;
    } else {
      feat.attributes[keys[idx]] = attr[keys[idx]];
    }
  }
  delete this.data.editAttrib;
  this.incrChange();
};

// getter
DU.Clip.prototype.featureValue = function(app, feature, env) {
  return this.data.team.tokens[this.data.currentToken].apps[app].features[feature][env];
};

// setter
DU.Clip.prototype.setFeatureValue = function(app, feature, env, val) {
  this.data.team.tokens[this.data.currentToken].apps[app].features[feature][env] = val;
};

// store which feature we're currently editing - we need to do this when a user renames a feature
DU.Clip.prototype.setEditFeature = function(feature) {
  this.data.editFeature = feature;
};

// add a new feature to an app
DU.Clip.prototype.addFeature = function(key, feature, app) {
  if (undefined == this.data.team.tokens[this.data.currentToken].apps[app].features)
    this.data.team.tokens[this.data.currentToken].apps[app].features = {};
  this.data.team.tokens[this.data.currentToken].apps[app].features[key] = feature;
  this.incrChange();
};

// getter
DU.Clip.prototype.editFeature = function() {
  if (undefined != this.data.editFeature) {
    return this.data.editFeature;
  }
  return "";
};

// logic to remove the feature. I also store the original data in case the user decides to undo
DU.Clip.prototype.deleteFeature = function(feature, appName) {
  var app = this.getApps();
  
  if (undefined == this.data.restoreData) {
    this.data.restoreData = {apps:{}};
    this.data.restoreData.apps[appName] = {
      keys: Object.keys(app[appName].features),
      features: {}
    };
    this.data.restoreData.apps[appName].features[feature] = app[appName].features[feature];
  } else {
    this.data.restoreData.apps[appName].features[feature] = app[appName].features[feature];
  }
  delete app[appName].features[feature];
  this.data.changeCount = 1;
};

/**
 * this may seem a little odd at first, but I want to retain the order of the elements
 * in the features object. To do that, I get the keys remove the old key
 * add the new key in the same index as the old, then rebuild the features object.
 */
DU.Clip.prototype.updateFeature = function(feature, appName) {
  var app = this.data.team.tokens[this.data.currentToken].apps[appName];
  var appf = app.features[this.data.editFeature];
  var keys = Object.keys(app.features);
  var idx  = keys.indexOf(this.data.editFeature);
  var allFeatures = app.features;
  delete app.features;
  app.features = {};
  keys[idx] = feature;
  allFeatures[feature] = appf;
  
  // build the features object back up.
  for (var i=0;i<keys.length;++i) {
    app.features[keys[i]] = allFeatures[keys[i]];
  }
  this.data.editFeature = "";
  this.incrChange();
};

/**
 * this is a little complicated - maybe there's a more reactjs way to do this
 * I will go through and restore any features that were removed by checking to see
 * which keys in the restore data are missing in the app data.
 */
DU.Clip.prototype.restore = function() {
  $.ajax({
    url: this.data.sourceUrl,
    dataType: 'json',
    type: 'GET',
    data: null,
    success: function(data) {
      this.data.changeCount = 0;
      this.setTeam(data);
      this.setToken(this.data.currentToken);
      this.resetData();      
      renderSaveButton();
      run(true);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.data.sourceUrl, status, err.toString());
    }.bind(this)
  });
  return;
  var apps = this.getApps();
  var keys = this.getAppNames();
  if (this.hasRestore()) {
    var rdata = this.getRestoreData();
    for (var index = 0; index < keys.length; ++index) {
      var appkey = keys[index];
      if (undefined != rdata.apps[appkey]) {
        for (var idx = 0; idx < rata.apps[appkey].keys.length; idx++) {
          var featurekey = rata.apps[appkey].keys[idx];
          if (undefined == apps[appkey].features[featurekey]) {
            apps[appkey].features[featurekey] = rdata.apps[appkey].features[featurekey];
          }
        }
      }
    }
  }

  delete this.data.restoreData;
  this.incrChange();
  
};

// we call this to reset
DU.Clip.prototype.resetData = function() {
  this.changeCount(0);
  this.setButtonVisible(false);
  var team = store.selectedTeam() || getQueryVariable('team') || '';
  this.selectTeam(team);
};

// logic for storing data in the backend
DU.Clip.prototype.save = function() {
  $.ajax({
    url: this.data.sourceUrl,
    dataType: 'json',
    type: 'PUT',
    data: JSON.stringify(this.team()),
    success: function(data) {
      this.data.changeCount = 0;
      run(true);
      renderSaveButton();
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(data.sourceUrl, status, err.toString());
    }.bind(this)
  });
  this.resetData();
};
