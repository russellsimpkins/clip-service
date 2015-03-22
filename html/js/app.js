"use strict";

var getQueryVariable = function(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){
      return pair[1];
    }
  }
  return(false);
};

var TeamList = React.createClass({

  getInitialState: function() {
    return { teamList: {} };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      if (this.isMounted()) {
        this.setState({
          teamList: JSON.parse(result)
        });
      }
    }.bind(this));
  },

  render: function() {
    $('#teamNav').addClass('active');
    $('#tokenNav').removeClass('active');
    $('#appNav').removeClass('active');
    if ($.isEmptyObject(this.state.teamList)) {
      return false;
    }

    var teamNodes = this.state.teamList.teams.map(function (team) {
      return (
        <Team data={team.teamName} key={team.teamName} />
      );
    });
    return (
      <div className="col-sm-6 bootcards-list col-centered">
        <div className="panel panel-default">
          <div className="list-group">
            {teamNodes}
          </div>
        </div>
      </div>
    );
  }
});

var Team = React.createClass({
  handleClick: function(event) {
    currentAppData.team = this.props.data;
    run();
  },
  render: function() {
    return (
      <a className="list-group-item" href="#" onClick={this.handleClick}>
        <h4 className="list-group-item-heading">{this.props.data}</h4>
      </a>
    );
  }
});


var TokenList = React.createClass({

  getInitialState: function() {
    return { teamData: {} };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      var jsonData;
      if (this.isMounted()) {
        jsonData = JSON.parse(result);
        this.setState({
          teamData: jsonData
        });
        currentAppData.teamData = jsonData;
      }
    }.bind(this));
  },

  render: function() {
    $('#teamNav').removeClass('active');
    $('#tokenNav').addClass('active');
    $('#appNav').removeClass('active');
    if ($.isEmptyObject(this.state.teamData)) {
      return false;
    }

    var tokenNodes = this.state.teamData.tokens.map(function (token, tokenIndex) {
      return (
        <Token data={token} tokenIndex={tokenIndex} key={tokenIndex}/>
      );
    });

    return (
      <div className="col-sm-6 bootcards-list col-centered">
        <div className="panel panel-default">
          <div className="list-group">
            {tokenNodes}
          </div>
        </div>
      </div>
    );
  }
});

var Token = React.createClass({
  handleClick: function(event) {
    currentAppData.tokenIndex = this.props.tokenIndex;
    run();
  },
  render: function() {
    return (
      <a className="list-group-item" href="#" onClick={this.handleClick}>
        <h4 className="list-group-item-heading">{this.props.data.name}</h4>
      </a>
    );
  }
});


var ApplicationGroups = React.createClass({

  getInitialState: function() {
    return { apps: currentAppData.teamData.tokens[currentAppData.tokenIndex].apps };
  },

  render: function() {
    $('#teamNav').removeClass('active');
    $('#tokenNav').removeClass('active');
    $('#appNav').addClass('active');
    if ($.isEmptyObject(this.state.apps)) {
      return false;
    }    
    var refresh = this.props.refresh || false;
    if (undefined != currentAppData.refreshFeatures && currentAppData.refreshFeatures) {
      delete currentAppData.refreshFeatures;
      refresh=true;
    }
    var appNames = Object.keys(currentAppData.teamData.tokens[currentAppData.tokenIndex].apps);
    var appData = currentAppData.teamData.tokens[currentAppData.tokenIndex].apps;
    var appList = appNames.map(function (appName) {
    
    return (
        <div className="col-sm-12" key={appName}>
        <h3 className="col-sm-12 row">Application: <ApplicationTitle appName={appName} /></h3><NewAppButton />
          <div className="row">
            <FeatureCardGroup refresh={refresh} data={appData[appName].features} meta={appName}/>
          </div>
        </div>
      );
    });
    return (
      <div>
        {appList}
      </div>
    );
  }
});

function saveAppTitle(app) {
  var apps = currentAppData.teamData.tokens[currentAppData.tokenIndex].apps;
  var keys = Object.keys(apps);
  var what = keys.indexOf(currentAppData.editApp);
  currentAppData.teamData.tokens[currentAppData.tokenIndex].apps = {};
  var appd = apps[currentAppData.editApp];
  delete apps[currentAppData.editApp];
  for (var idx = 0; idx < keys.length; ++idx) {
    if (idx == what) {
      currentAppData.teamData.tokens[currentAppData.tokenIndex].apps[app] = appd;
    } else {
      currentAppData.teamData.tokens[currentAppData.tokenIndex].apps[keys[idx]] = apps[keys[idx]];
    }
  }
  currentAppData.editApp = "";
  saveAppState();
}

var ApplicationTitle = React.createClass({
  getInitialState: function() {
    return {value: this.props.appName};
  },
  handleClick: function(app, saveit) {
    if (saveit === 1) {
      saveAppTitle(app);
    } else {
      currentAppData.editApp = app;
    }
    run();
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  onKeyPress: function(event) {
    if (event.charCode === 13) {
      saveAppTitle(event.target.value);
      run();
    }
  },
  render: function() {
    var value = this.state.value;
    var edit = ( undefined != currentAppData.editApp && currentAppData.editApp == this.props.appName) ? true : false;
    return (
        <div>{edit ? <span><input type="text" value={value} onChange={this.handleChange} onKeyPress={this.onKeyPress} size="20"></input><i className="fa fa-floppy-o save" value="save" onClick={this.handleClick.bind(null, this.state.value, 1)} /></span> : <span className="edit" onClick={this.handleClick.bind(null, this.props.appName, 0)}>{this.props.appName}</span>}</div>
    );
  }
});

var FeatureDelete = React.createClass({
  handleClick: function(appName, feature) {
    var app = currentAppData.teamData.tokens[currentAppData.tokenIndex].apps[appName];
    if (undefined == currentAppData.restoreData) {
      currentAppData.restoreData = {apps:{}};
      currentAppData.restoreData.apps[appName] = {
        keys: Object.keys(app.features),
        features: {}
      };
      currentAppData.restoreData.apps[appName].features[feature] = app.features[feature];
    } else {
      currentAppData.restoreData.apps[appName].features[feature] = app.features[feature];
    }
    delete app.features[feature];
    currentAppData.changeCount = 1;
    renderSaveButton();
    run();
  },
  render: function() {
    return (
        <i className="fa fa-times-circle-o" value="save" onClick={this.handleClick.bind(null, this.props.metaData.appName, this.props.metaData.featureName)} />
    );
  }
});
var FeatureTitle = React.createClass({
  getInitialState: function() {
    return {value: this.props.featureName};
  },
  handleClick: function(feature, appName, saveit) {
    if (saveit === 1) {

      // this seems a little odd, but I want to retain the order of the elements
      // in the features object. To do that, I get the keys remove the old key
      // add the new key in the same index as the old, then rebuild the features object.
      var app = currentAppData.teamData.tokens[currentAppData.tokenIndex].apps[appName];
      var appf = app.features[currentAppData.editFeature];
      var keys = Object.keys(app.features);
      var idx  = keys.indexOf(currentAppData.editFeature);
      var allFeatures = app.features;
      delete app.features;
      app.features = {};
      keys[idx] = feature;
      allFeatures[feature] = appf;
      
      // build the features object back up.
      for (var i=0;i<keys.length;++i) {
        app.features[keys[i]] = allFeatures[keys[i]];
      }
      currentAppData.editFeature = "";
      saveAppState();
    } else {
      currentAppData.editFeature = feature;
    }
    run();
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  render: function() {
    var value = this.state.value;
    var edit = ( undefined != currentAppData.editFeature && currentAppData.editFeature == this.props.featureName) ? true : false;
    return (
        <div>{edit ? <span><input type="text" value={value} onChange={this.handleChange} size="20"></input><i className="fa fa-floppy-o save" value="save" onClick={this.handleClick.bind(null, this.state.value, this.props.appName, 1)} /></span> : <span className="edit" onClick={this.handleClick.bind(null, this.props.featureName, this.props.appName, 0)}>{this.props.featureName}</span>}</div>
    );
    }
  
});

var FeatureCardGroup = React.createClass({

  render: function() {
    var refresh      = this.props.refresh || false;
    var meta         = this.props.meta;
    var featureNames = Object.keys(this.props.data);
    var featureData  = this.props.data;

    var featureList  = featureNames.map(function (feature) {
      return (
        <FeatureCard refresh={refresh} data={featureData[feature]} featureName={feature} key={feature} meta={meta} />
      )
    });
    return (
      <div>
        {featureList}
            <NewFeatureButton appname={meta} />
      </div>
    );
  }
});


var FeatureCard = React.createClass({
  render: function() {
    var metaData = {
      appName: this.props.meta,
      featureName: this.props.featureName,
      refresh: this.props.refresh
    };
    return (
      <div className="col-sm-4">
        <div className="panel panel-default bootcards-summary">
          <div className="panel-heading">
        <h3 className="panel-title"><FeatureTitle featureName={metaData.featureName} appName={metaData.appName} /></h3>
        <FeatureDelete metaData={metaData} />
          </div>
          <div className="panel-body">
            <div className="row">
              <EnvironmentFlag env="sbx" data={this.props.data.sbx} meta={metaData} />
              <EnvironmentFlag env="dev" data={this.props.data.dev} meta={metaData} />
              <EnvironmentFlag env="stg" data={this.props.data.stg} meta={metaData} />
              <EnvironmentFlag env="int" data={this.props.data.int} meta={metaData} />
              <EnvironmentFlag env="prd" data={this.props.data.prd} meta={metaData} />
            </div>
          </div>
          <AttributeList data={this.props.data.attributes} meta={metaData} />
        </div>
      </div>
    );
  }
});


var EnvironmentFlag = React.createClass({
  getInitialState: function() {
    return ({
        active: (this.props.data === 1),
        change: false
    })
  },
  handleClick: function(meta, env) {

    // Change the data in the main object for saving later
    var tIdx = currentAppData.tokenIndex;
    var val = currentAppData.teamData.tokens[tIdx].apps[meta.appName].features[meta.featureName][env];
    if (val == 0) {
      val = 1;
    } else {
      val = 0;
    }
    currentAppData.teamData.tokens[tIdx].apps[meta.appName].features[meta.featureName][env] = val;

    if (this.state.change === false) {
      currentAppData.changeCount++;
    } else {
      currentAppData.changeCount--;
    }

    this.setState({
      active: !this.state.active,
      change: !this.state.change
    });
    renderSaveButton();
  },
  render: function() {
    var metaData = this.props.meta;
    if (metaData.refresh) {
      this.state.change = false;
    }
    var classes = "bootcards-summary-item";
    if (this.state.active) {
      classes += " active";
    }
    return (
      <div className="col-xs-6 col-sm-4">
        <a className={classes} href="#" onClick={this.handleClick.bind(null, metaData, this.props.env)}>
          <i className="fa fa-3x fa-star"></i>
          <h4>{this.props.env}{this.state.change ? <span className="label label-danger">!</span> : ''}</h4>
        </a>
      </div>
    );
  }
});

var AttributeList = React.createClass({
  handleClick: function(meta) {
    var d = new Date();
    var f = "f " + d.getTime();
    currentAppData.teamData.tokens[currentAppData.tokenIndex].apps[meta.appName].features[meta.featureName].attributes[f] = false;
    currentAppData.changeCount++;
    renderSaveButton();
    run();
  },
  render: function() {
    var metaData = this.props.meta;
    var attribs = Object.keys(this.props.data);
    var attribData = this.props.data;
    var flagAttributes = attribs.map(function (attrib) {
      return (
        <AttributeFlag key={attrib} data={attribData[attrib]} attribName={attrib} meta={metaData}/>
      )
    });
    return (
      <div className="panel-footer">
        {flagAttributes} <div><span onClick={this.handleClick.bind(null, metaData)}><i className="fa fa-plus" /><span className="pad5">Add boolen attribute</span></span></div>
      </div>
    );
  }
});

var AttributeFlag = React.createClass({
  getInitialState: function() {
    return ({
        active: (this.props.data === true),
        change: false
    })
  },
  handleClick: function(meta, attrib) {
    // Change the data in the main object for saving later
    var tIdx = currentAppData.tokenIndex;
    var val = currentAppData.teamData.tokens[tIdx].apps[meta.appName].features[meta.featureName]["attributes"][attrib];
    if (val == true) {
      val = false;
    } else {
      val = true;
    }
    currentAppData.teamData.tokens[tIdx].apps[meta.appName].features[meta.featureName]["attributes"][attrib] = val;


    if (this.state.change === false) {
      currentAppData.changeCount++;
    } else {
      currentAppData.changeCount--;
    }
    this.setState({
      active: !this.state.active,
      change: !this.state.change
    });
    renderSaveButton();
  },
  render: function() {
    var metaData = this.props.meta;
    if (metaData.refresh) {
      this.state.change = false;
    }
    var classes = "featureAttribute";
    var iconClasses = "fa";
    if (this.state.active) {
      classes += " enableAttr";
      iconClasses += " fa-check-circle";
    } else {
      iconClasses += " fa-circle-o";
    }
    return (
      <span>
        <a className={classes} onClick={this.handleClick.bind(null, metaData, this.props.attribName)}>
 <i className={iconClasses}></i></a><AttributeName meta={metaData} attrib={this.props.attribName} />
        {this.state.change ? <span className="label label-danger">!</span> : ''}<br/>
      </span>
    );
  }
});
function saveAttribute(value, attribute, feature, appname) {
  var apps = currentAppData.teamData.tokens[currentAppData.tokenIndex].apps[appname].features[feature].attributes;
  var s = apps[currentAppData.editAttrib];
  delete apps[currentAppData.editAttrib];
  apps[value] = s;
  delete currentAppData.editApp;
  saveAppState();
}
var AttributeName = React.createClass({
  getInitialState: function() {
    return {value: this.props.attrib};
  },
  handleClick: function(newName, save) {
    if (save === 0) {
      currentAppData.editAttrib = newName;
    } else {
      saveAttribute(event.target.value,
                    currentAppData.editAttrib,
                    this.props.meta.featureName,
                    this.props.meta.appName);
    }
    run();
  },
  onKeyPress: function(event) {
    if (event.charCode === 13) {
      saveAttribute(event.target.value,
                    currentAppData.editAttrib,
                    this.props.meta.featureName,
                    this.props.meta.appName);
      run();
    }
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  render: function() {
    var meta = this.props.meta;
    var value = this.state.value;
    var edit = ( undefined != currentAppData.editAttrib && currentAppData.editAttrib == this.props.attrib) ? true : false;
    
    return (
        <span className="pad5">{edit ? <span><input type="text" value={value} onChange={this.handleChange} onKeyPress={this.onKeyPress} size="20"></input><i className="fa fa-floppy-o save" value="save" onClick={this.handleClick.bind(null, this.state.value, 1)} /></span> : <span className="edit" onClick={this.handleClick.bind(null, this.props.attrib, 0)}>{this.props.attrib}</span>}</span>
    );
  }
});
var NewFeatureButton = React.createClass({
    handleClick: function(){
      var feat = {"attributes":{},"sbx":0,"dev":0,"stg":0,"int":0,"prd":0};
      var feats = currentAppData.teamData.tokens[currentAppData.tokenIndex].apps[this.props.appname].features;
      var d = new Date();
      feats["untitled " + d.getTime()]= feat;
      currentAppData.changeCount = 1;
      renderSaveButton();
      run();
  },
  render: function() {
      var classes = "btn btn-default btn-lg footer-btn";
      var metaData = this.props.meta;

    return (
      <div className="row">
        <button type="button" className={classes} onClick={this.handleClick.bind(null, metaData, this.props.attribName)}>
          <span className="glyphicon glyphicon-plus"></span> Add A Feature Flag
        </button>
      </div>
    );
  }
});

var NewAppButton = React.createClass({
  handleClick: function(){
    var feat = {"attributes":{},"sbx":0,"dev":0,"stg":0,"int":0,"prd":0};
      
    var d = new Date();
    var feats = currentAppData.teamData.tokens[currentAppData.tokenIndex].apps["New APP " + d.getTime()] = {};
    feats.features = {};
    feats["untitled " + d.getTime()]= feat;
    currentAppData.changeCount = 1;
    renderSaveButton();
    run();
  },
  render: function() {
      var classes = "btn btn-default btn-lg footer-btn";
      var metaData = this.props.meta;

    return (
      <div className="row">
        <button type="button" className={classes} onClick={this.handleClick.bind(null, metaData, this.props.attribName)}>
          <span className="glyphicon glyphicon-plus"></span> Add Application
        </button>
      </div>
    );
  }
});

var SaveButton = React.createClass({
  handleClick: function(restore){
    // this is a little complicated - maybe there's a more reactjs way to do this
    // I will go through and restore any features that were removed by checking to see
    // which keys in the restore data are missing in the app data.
    if (restore === 1 && undefined != currentAppData.restoreData) {
      var apps = currentAppData.teamData.tokens[currentAppData.tokenIndex].apps;
      var keys = Object.keys(apps);
      for (var index = 0; index < keys.length; ++index) {
        var appkey = keys[index];
        if (undefined != currentAppData.restoreData.apps[appkey]) {
          for (var idx = 0; idx < currentAppData.restoreData.apps[appkey].keys.length; idx++) {
            var featurekey = currentAppData.restoreData.apps[appkey].keys[idx];
            if (undefined == apps[appkey].features[featurekey]) {
              apps[appkey].features[featurekey] = currentAppData.restoreData.apps[appkey].features[featurekey];
            }
          }
        }
      }
    }
    delete currentAppData.restoreData;
    saveAppState();
    resetData();
  },
  render: function() {
    var classes = "btn btn-default btn-lg btn-danger footer-btn";
    var restoreClass = "btn btn-default btn-lg btn-info footer-btn";
    if (undefined == currentAppData.restoreData) {
      restoreClass +=  ' hidden'
    }
    if (currentAppData.changeCount === 1 && currentAppData.saveButtonVisibile === false) {
      currentAppData.saveButtonVisibile = true;
      classes += " fade-in";
    }
    else if (currentAppData.changeCount === 0 && currentAppData.saveButtonVisibile === true) {
      currentAppData.saveButtonVisibile = false;
      classes += " fade-out";
    }
    else if (currentAppData.changeCount == 0) {
      currentAppData.saveButtonVisibile = false
      classes += " hidden";
    }
    return (
      <div className="footer">
        <button type="button" className={classes} onClick={this.handleClick}>
          <span className="glyphicon glyphicon-floppy-disk"></span> Save
      </button>
        <button type="button" className={restoreClass} onClick={this.handleClick.bind(null,1)}>
          <span className="fa fa-undo"></span> Undo
        </button>
      </div>
    );
  }
});

var MainScreen = React.createClass({

  selectApp: function() {
    var sourceUrl;

    if (!currentAppData.team) {
      return <TeamList source="/svc/clip/teams" />;
    }

    currentAppData.sourceUrl = "/svc/clip/team/" + currentAppData.team
    if (!currentAppData.teamData) {
      return <TokenList source={currentAppData.sourceUrl} />;
    }

    return <ApplicationGroups refresh={this.props.refresh} source={currentAppData.sourceUrl} />;
  },
  render: function() {
    var app = this.selectApp();
    return(
      <div>
        {app}
      </div>
    );
  }
});

var currentAppData = {};

var resetData = function() {
  currentAppData.changeCount = 0;
  currentAppData.saveButtonVisibile = false;
  console.log(getQueryVariable('team'));
  currentAppData.team = currentAppData.team || getQueryVariable('team') || '';
}

var run = function(forceRefresh) {  
  //resetData();
  console.log("currentAppData");
  console.log(currentAppData);
  var refresh = true;
  // Main APP
  React.render(<MainScreen refresh={refresh}  />, document.getElementById('content'));
}
var saveAppState = function() {
  $.ajax({
    url: currentAppData.sourceUrl,
    dataType: 'json',
    type: 'PUT',
    data: JSON.stringify(currentAppData.teamData),
    success: function(data) {
      run();
      renderSaveButton();
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(currentAppData.sourceUrl, status, err.toString());
    }.bind(this)
  });
}
var renderSaveButton = function() {
  React.render(<SaveButton />, document.getElementById('footer'));
}

run();
