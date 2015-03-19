"use strict";

var TeamList = React.createClass({
  render: function() {
    var teamNodes = this.props.data.map(function (team) {
      return (
        <Team data={team.teamName}/>
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
  render: function() {
    return (
      <a className="list-group-item" href="#">
        <h4 className="list-group-item-heading">{this.props.data}</h4>
      </a>
    );
  }
});

var FeatureCard = React.createClass({
  render: function() {
    return (
      <div className="col-sm-4">
        <div className="panel panel-default bootcards-summary">
          <div className="panel-heading">
            <h3 className="panel-title">usePapiBlogs</h3>
          </div>
          <div className="panel-body">
            <EnvList />
          </div>
          <div className="panel-footer">
            <span className="enableAttr"><i className="fa fa-check-circle"></i> FrontEndEnabled</span>
          </div>
        </div>
      </div>
    );
  }
});

var EnvList = React.createClass({
  render: function() {
    return (
      <div className="row">
        <EnvironmentFlag env="sbx"/>
        <EnvironmentFlag env="dev"/>
        <EnvironmentFlag env="stg"/>
        <EnvironmentFlag env="prd"/>
      </div>
    );
  }
});

var EnvironmentFlag = React.createClass({
  render: function() {
    return (
      <div className="col-xs-6 col-sm-4">
        <a className="bootcards-summary-item" href="#">
          <i className="fa fa-3x fa-star"></i>
          <h4>{this.props.env}<span className="label label-danger">!</span></h4>
        </a>
      </div>
    );
  }
});

var teamData = [
  {teamName: "DataUniverse"},
  {teamName: "MobileWeb"}
];

React.render(<TeamList data={teamData} />, document.getElementById('content'));

