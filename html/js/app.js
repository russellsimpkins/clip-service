"use strict";

var Team = $(location).attr('hash').substring(("#team=").length);
var store = new DU.Clip();

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
      console.log(1);
      if (this.isMounted()) {
        store.setTeams(JSON.parse(result));
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
    store.selectTeam(this.props.data);
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
        store.setTeam(jsonData);
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
    store.setToken(this.props.tokenIndex);
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
    return { apps: store.getApps() };
  },

  render: function() {
    $('#teamNav').removeClass('active');
    $('#tokenNav').removeClass('active');
    $('#appNav').addClass('active');
    if ($.isEmptyObject(this.state.apps)) {
      return false;
    }    
    var refresh = this.props.refresh || false;
    if (store.doRefresh()) {
      refresh = true;
    }
    var appNames = store.getAppNames();
    var appData = store.getApps();
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


var ApplicationTitle = React.createClass({
  getInitialState: function() {
    return {value: this.props.appName};
  },
  handleClick: function(app, saveit) {
    if (saveit === 1) {
      store.updateAppName(app);
      renderSaveButton();
    } else {
      store.setEditApp(app);
    }
    run();
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  onKeyPress: function(event) {
    if (event.charCode === 13) {
      store.updateAppName(event.target.value);
      run();
    }
  },
  render: function() {
    var value = this.state.value;
    var edit = (store.editApp() == this.props.appName);
    return (
        <div>{edit ? <span><input type="text" value={value} onChange={this.handleChange} onKeyPress={this.onKeyPress} size="20"></input><i className="fa fa-floppy-o save" value="save" onClick={this.handleClick.bind(null, this.state.value, 1)} /></span> : <span className="edit" onClick={this.handleClick.bind(null, this.props.appName, 0)}>{this.props.appName}</span>}</div>
    );
  }
});

var FeatureDelete = React.createClass({
  handleClick: function(appName, feature) {
    store.deleteFeature(feature, appName);
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
      store.updateFeature(feature, appName);
      //store.save();
      renderSaveButton();
    } else {
      store.setEditFeature(feature);
    }
    run();
  },
  onKeyPress: function(event, appName) {
    if (event.charCode === 13) {
      store.updateFeature(event.target.value, this.props.appName);
      renderSaveButton();
      //store.save();
      run();
    }
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  render: function() {
    var value = this.state.value;
    var edit = ( store.editFeature() == this.props.featureName);
    return (
        <div>{edit ? <span><input type="text" value={value} onChange={this.handleChange} onKeyPress={this.onKeyPress} size="20"></input><i className="fa fa-floppy-o save" value="save" onClick={this.handleClick.bind(null, this.state.value, this.props.appName, 1)} /></span> : <span className="edit" onClick={this.handleClick.bind(null, this.props.featureName, this.props.appName, 0)}>{this.props.featureName}</span>}</div>
    );
    }
  
});

var FeatureCardGroup = React.createClass({

  render: function() {
    var refresh      = this.props.refresh || false;
    var meta         = this.props.meta;
    if (undefined == this.props.data) {
      this.props.data = [];
    }
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
      appName:     this.props.meta,
      featureName: this.props.featureName,
      refresh:     this.props.refresh
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
    // RSS - left off here
    // Change the data in the main object for saving later
    var val = store.featureValue(meta.appName, meta.featureName, env);
    if (val == 0) {
      val = 1;
    } else {
      val = 0;
    }
    store.setFeatureValue(meta.appName, meta.featureName, env, val);
    

    if (this.state.change === false) {
      store.incrChange();
    } else {
      store.decChange();
    }

    this.setState({
      active: !this.state.active,
      change: !this.state.change
    });
    renderSaveButton();
    run();
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
    store.addAttribute(meta.appName, meta.featureName, f, false);
    store.incrChange();
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
        {flagAttributes} <div><span onClick={this.handleClick.bind(null, metaData)}><i className="fa fa-plus" /><span className="pad5">Add</span></span></div>
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
    store.toggleAttribute(meta.appName,meta.featureName,attrib);
    if (this.state.change === false) {
      store.incrChange();
    } else {
      store.decChange();
    }
    this.setState({
      active: !this.state.active,
      change: !this.state.change
    });
    renderSaveButton();
    run();
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

var AttributeName = React.createClass({
  getInitialState: function() {
    return {value: this.props.attrib};
  },
  handleClick: function(newName, save) {
    if (save === 0) {
      store.storeEditAttribute(newName);
    } else {
      store.saveAttribute(event.target.value,
                          this.props.meta.featureName,
                          this.props.meta.appName);
      renderSaveButton();
    }
    run();
  },
  onKeyPress: function(event) {
    if (event.charCode === 13) {
      store.saveAttribute(event.target.value,
                          this.props.meta.featureName,
                          this.props.meta.appName);
      renderSaveButton();
      run();
    }
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  render: function() {
    var meta = this.props.meta;
    var value = this.state.value;
    var edit = ( store.editAttribute() == this.props.attrib) ? true : false;
    
    return (
        <span className="pad5">{edit ? <span><input type="text" value={value} onChange={this.handleChange} onKeyPress={this.onKeyPress} size="20"></input><i className="fa fa-floppy-o save" value="save" onClick={this.handleClick.bind(null, this.state.value, 1)} /></span> : <span className="edit" onClick={this.handleClick.bind(null, this.props.attrib, 0)}>{this.props.attrib}</span>}</span>
    );
  }
});
var NewFeatureButton = React.createClass({
    handleClick: function(){
      var feat = {"attributes":{},"sbx":0,"dev":0,"stg":0,"int":0,"prd":0};
      var d = new Date();
      var key = "untitled " + d.getTime();
      store.addFeature(key, feat, this.props.appname);
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
    store.addApp();
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
    if (restore === 1) {
      store.restore();
    }
    store.save();
    resetData();
    run();
  },
  render: function() {
    var classes = "btn btn-default btn-lg btn-danger footer-btn";
    var restoreClass = "btn btn-default btn-lg btn-info footer-btn";
    if (store.hasRestore()) {
      restoreClass +=  ' hidden'
    }
    if (store.changeCount() === 1 && store.isButtonVisible() === false) {
      store.setButtonVisibile(true);
      classes += " fade-in";
    }
    else if (store.changeCount() === 0 && store.isButtonVisible() === true) {
      store.setButtonVisibile(false);
      classes += " fade-out";
    }
    else if (store.changeCount() == 0) {
      store.setButtonVisible(false);
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
    var sourceUrl = "/svc/clip/teams";
    if (!store.isTeamSelected()) {
      return <TeamList source={sourceUrl} />;
    }
    sourceUrl = "/svc/clip/team/" + store.selectedTeam();
    if (store.token() == -1) {
      return <TokenList source={sourceUrl} />;
    }
    return <ApplicationGroups refresh={this.props.refresh} source={sourceUrl} />;
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
  store.changeCount(0);
  store.setButtonVisible(false);
  //store.token(-1);
  console.log(getQueryVariable('team'));
  var team = store.selectedTeam() || getQueryVariable('team') || '';
  store.selectTeam(team);
}

var run = function(forceRefresh) {  
  console.log(store.team());
  var refresh = true;
  // Main APP
  React.render(<MainScreen refresh={refresh}  />, document.getElementById('content'));
}

var saveAppState = function() {
  $.ajax({
    url: currentAppData.sourceUrl,
    dataType: 'json',
    type: 'PUT',
    data: JSON.stringify(store.team()),
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
