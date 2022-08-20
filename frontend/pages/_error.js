import { Component } from "react";
import Router from "next/router";

export default class _error extends Component {
  componentDidMount = () => {
    Router.push("/auth/login");
  };

  render() {
    return <div />;
  }
}
