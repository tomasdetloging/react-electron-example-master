import React, { Component } from "react";
import {
  CardHeader,
  CardTitle,
  CardBody,
  Card,
  Input,
  Button,
  Row,
} from "reactstrap";
import Container from "reactstrap/lib/Container";
import Col from "reactstrap/lib/Col";
import mongose from "mongoose";
import { editItem } from "fetchers/items";
import YouTube from "react-youtube";
import Vimeo from "@u-wave/react-vimeo";

export default class VideoInformation extends Component {
  constructor(props) {
    super();
    this.state = {
      item_title: props.item.item_title,
      item_video_url: props.item.item_video_url,
      item_author_id: props.item.item_author_id,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      item_title: props.item.item_title,
      item_video_url: props.item.item_video_url,
      item_author_id: props.item.item_author_id,
    });
  }

  onHandleSubmit = (e) => {
    e.preventDefault();
    editItem(this.props.item._id, this.state, (data) => {
      this.props.handleItemChanged(data);
    });
  };

  componentDidUpdate() {
    setTimeout(() => {
      //validation input AuthorId
      let inputId = document.getElementById("imput");
      if (inputId)
        inputId.addEventListener("input", (e) => {
          if (!mongose.Types.ObjectId.isValid(inputId.value)) {
            inputId.setCustomValidity("!invalid");
          } else {
            inputId.setCustomValidity("");
          }
        });
    }, 500);
  }

  render() {
    const src = this.state.item_video_url || "";
    let id = "";
    if (src.startsWith("https://www.youtube.com/watch")) {
      id = new URL(src).searchParams.get("v");
    } else if (src.startsWith("https://www.youtube.com/embed/")) {
      id = new URL(src).pathname.slice(7);
    } else if (src.startsWith("https://youtu.be/")) {
      id = new URL(src).pathname;
    }

    if (src.startsWith("https://vimeo.com/")) {
      id = new URL(src).pathname.slice(1);
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h4" className="mb-0 d-flex">
            <i className="fa fa-film mr-3" />
            {this.state.item_title}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Container fluid>
            <Row>
              <Col xs="6">
                <div className="d-flex">
                  <>
                    <div className="video-container shadow">
                      {(src.startsWith("https://www.youtube") ||
                        src.startsWith("https://youtu.be")) && (
                        <YouTube videoId={id} />
                      )}
                      {src.includes("vimeo") && <Vimeo video={id} autoplay />}
                    </div>
                  </>
                </div>
              </Col>
              <Col xs="6">
                <form onSubmit={this.onHandleSubmit}>
                  <p className="m-0 mt-1">titulo:</p>
                  <Input
                    value={this.state.item_title || ""}
                    onChange={(e) => {
                      this.setState({ item_title: e.target.value });
                    }}
                    name="item_title"
                    required
                  />

                  <p className="m-0 mt-1">author id:</p>
                  <Input
                    id="imput"
                    value={this.state.item_author_id || ""}
                    onChange={(e) => {
                      this.setState({ item_author_id: e.target.value });
                    }}
                    type="text"
                    name="item_author_id"
                    required
                  />

                  <p className="m-0 mt-1">video url:</p>
                  <Input
                    value={this.state.item_video_url || ""}
                    onChange={(e) => {
                      this.setState({ item_video_url: e.target.value });
                    }}
                    type="textarea"
                    name="item_video_url"
                    required
                  />

                  <div className="d-flex">
                    <Button
                      type="submit"
                      color="success"
                      className="mt-3 ml-auto"
                    >
                      <i className="fa fa-save mr-2" />
                      Save
                    </Button>
                  </div>
                </form>
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>
    );
  }
}
