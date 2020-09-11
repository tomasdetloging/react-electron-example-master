import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";
import ToolBar from "./ToolBar";
import VideoInformation from "./VideoInformation";
import Axios from "axios";
import { courseItemsUrl } from "config";
import ListItems from "./ListItems";

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      course: props.course,
      items: null,
      targetItem: null,
    };
  }

  handleItemChanged = (item) => {
    let index = this.state.items.findIndex((_item) => {
      return item._id === _item._id;
    });

    let newItems = [...this.state.items];
    if (index !== -1) {
      newItems[index] = item;
    } else {
      newItems.push(item);
    }

    this.setState({
      items: newItems,
      targetItem: item,
    });
  };

  handleItemTargetChanged = (item) => {
    this.setState({
      targetItem: item,
    });
  };

  componentDidMount() {
    Axios.get(courseItemsUrl + "/" + this.state.course.course_short_link)
      .then((response) => {
        this.setState({
          items: response.data.items,
        });
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  }

  render() {
    return (
      <>
        <ToolBar setCurrentView={this.props.setCurrentView} />
        <Container fluid>
          <Row>
            <Col xs="8">
              {this.state.targetItem ? (
                <>
                  <VideoInformation
                    handleItemChanged={this.handleItemChanged}
                    item={this.state.targetItem}
                  />
                </>
              ) : null}
            </Col>

            <Col xs="4">
              <ListItems
                course={this.props.course}
                handleItemTargetChanged={this.handleItemTargetChanged}
                handleItemChanged={this.handleItemChanged}
                items={this.state.items}
              />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default App;
