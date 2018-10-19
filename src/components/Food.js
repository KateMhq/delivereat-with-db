import React from "react";

class Food extends React.Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.basket.find(item => item.id == this.props.id)) {
      this.props.receiveRemoveFromBasket(this.props.id)

    } else {
      this.props.receiveAddToBasket(this.props.id);

    }
  }

  render() {
    const image_link = `/static/${this.props.image}`;
    return (
      <div>
        <h2>{this.props.name}</h2>
        <img src={image_link} />
        <p>
          {this.props.price.toLocaleString("en-UK", {
            style: "currency",
            currency: "GBP"
          })}
        </p>
        {this.props.basket !== undefined ?
        (this.props.basket.find(item => item.id==this.props.id)
          ? (
          <p type="button" onClick={this.handleClick}>
            Remove from cart
          </p>
        ) : (
          <p type="button" onClick={this.handleClick}>
            Add to cart
          </p>
        ) ): null
      }
      </div>
    );
  }
}

export default Food;