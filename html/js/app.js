"use strict";

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
      }
    }.bind(this));
  },

  render: function() {
    if ($.isEmptyObject(this.state.teamData)) {
      return false;
    }

    var tokenNodes = this.state.teamData.tokens.map(function (token) {
      return (
        <Token data={token} />
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
    currentAppData.token = this.props.data;
    currentAppData.apps  = this.props.data.apps;
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
    return { apps: currentAppData.apps };
  },

  componentDidMount: function() {
    if (!this.state.apps) {
      //TODO
      // $.get(this.props.source, function(result) {
      //   if (this.isMounted()) {
      //     this.setState({
      //       apps: JSON.parse(result)
      //     });
      //   }
      // }.bind(this));
    }
  },

  render: function() {
    if ($.isEmptyObject(this.state.apps)) {
      return false;
    }

    var appNames = Object.keys(this.state.apps);
    var appData = this.state.apps;
    var appList = appNames.map(function (appName) {
      return (
        <div className="col-sm-12">
          <h3 className="col-sm-12 row">Application: {appName}</h3>
          <div className="row">
            <FeatureCardGroup data={appData[appName].features} />
          </div>
        </div>
      );
    });
    return (
      <div>{appList}</div>
    );
  }
});


var FeatureCardGroup = React.createClass({

  render: function() {

    var featureNames = Object.keys(this.props.data);
    var featureData = this.props.data;
    var featureList = featureNames.map(function (feature) {
      return (
        <FeatureCard data={featureData[feature]} featureName={feature} />
      )
    });
    return (
      <div>{featureList}</div>
    );
  }
});


var FeatureCard = React.createClass({
  render: function() {
    return (
      <div className="col-sm-4">
        <div className="panel panel-default bootcards-summary">
          <div className="panel-heading">
            <h3 className="panel-title">{this.props.featureName}</h3>
          </div>
          <div className="panel-body">
            <div className="row">
              <EnvironmentFlag env="sbx" data={this.props.data.sbx}/>
              <EnvironmentFlag env="dev" data={this.props.data.dev}/>
              <EnvironmentFlag env="stg" data={this.props.data.stg}/>
              <EnvironmentFlag env="int" data={this.props.data.int}/>
              <EnvironmentFlag env="prd" data={this.props.data.prd}/>
            </div>
          </div>
          <AttributeList data={this.props.data.attributes} />
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
  handleClick: function() {
    if (this.state.change === false) {
      currentAppData.changeCount++;
    } else {
      currentAppData.changeCount--;
    }
    this.setState({
      active: !this.state.active,
      change: !this.state.change
    });
  },
  render: function() {
    var classes = "bootcards-summary-item";
    if (this.state.active) {
      classes += " active";
    }
    return (
      <div className="col-xs-6 col-sm-4">
        <a className={classes} href="#" onClick={this.handleClick}>
          <i className="fa fa-3x fa-star"></i>
          <h4>{this.props.env}{this.state.change ? <span className="label label-danger">!</span> : ''}</h4>
        </a>
      </div>
    );
  }
});

var AttributeList = React.createClass({

  render: function() {
    var attribs = Object.keys(this.props.data);
    var attribData = this.props.data;
    var flagAttributes = attribs.map(function (attrib) {
      return (
        <AttributeFlag data={attribData[attrib]} attribName={attrib} />
      )
    });
    return (
      <div className="panel-footer">
        {flagAttributes}
      </div>
    );
  }
});

var AttributeFlag = React.createClass({
  getInitialState: function() {
    return ({
        active: (this.props.data === 1),
        change: false
    })
  },
  handleClick: function() {
    console.log('CLICK!');
    if (this.state.change === false) {
      currentAppData.changeCount++;
    } else {
      currentAppData.changeCount--;
    }
    this.setState({
      active: !this.state.active,
      change: !this.state.change
    });
  },
  render: function() {
    var classes = "featureAttribute";
    var iconClasses = "fa";
    if (this.state.active) {
      classes += " enableAttr";
      iconClasses += " fa-check-circle";
    } else {
      iconClasses += " fa-circle-o";
    }
    return (
      <a className={classes} onClick={this.handleClick}><i className={iconClasses}></i> FrontEndEnabled</a>
    );
  }
});


var MainScreen = React.createClass({

  selectApp: function() {
    var sourceUrl;

    if (!this.props.data.team) {
      return <TeamList source="/svc/clip/teams" />;
    }

    sourceUrl = "/svc/clip/team/" + this.props.data.team
    if (!this.props.data.token) {
      return <TokenList source={sourceUrl} />;
    }

    return <ApplicationGroups source={sourceUrl} />;
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


//var teamData = {"teams":[{"teamName":"IOS"},{"teamName":"MobileWeb"},{"teamName":"Data Universe"},{"teamName":"WebTech"},{"teamName":"Search"}]};

var currentAppData = {
  changeCount: 0
};

var run = function() {
  console.log(currentAppData);
  // Main APP
  React.render(<MainScreen data={currentAppData} />, document.getElementById('content'));
}

run();
