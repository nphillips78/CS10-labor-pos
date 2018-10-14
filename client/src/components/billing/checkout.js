import React, { Component } from 'react';
import StripeCheckout from "react-stripe-checkout";
import { FormControlLabel, Checkbox, Typography, Card, Grid } from "@material-ui/core";


class Checkout extends Component {
  state = {
    subscriptionType: "",
    subscriptionAmount: null
  };

  setSubscriptionType = e => {
    const { value: subscriptionType } = e.target;
    const subscriptionAmount = Number(e.target.attributes["price"]);

    this.setState({
      subscriptionType,
      subscriptionAmount
    });
  };

  getStripeToken = token => {
    let apiURI = "http://localhost:8000/graphql/";

    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/graphql"
      },
      url: apiURI,
      data: { token, jwt: localStorage.getItem("token") },
      body: JSON.stringify({ query: "{ token: { id } }" })
    };

    axios({
      url: process.env.REACT_APP_ENDPOINT,
      method: "post",
      headers: {
        Authorization: "JWT " + localStorage.getItem(AUTH_TOKEN),
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        operationName: null,
        query: `mutation updateUser($id: ID, $subscription: String) {
            updateUser(id: $id, subscription: $subscription) {
              user {
                id
                premium
            }
          }
        }`,
        variables: {
          id: localStorage.getItem("USER_ID"),
          subscription: this.state.subscriptionType
        }
      })
    })
      .then(res => {
        console.log(res.data.data.updateUser.user.premium);
        localStorage.setItem(
          "USER_PREMIUM",
          res.data.data.updateUser.user.premium
        );
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
      <Card>
       <Typography paragraph>
                {"contractAlchemy provides two tiers of service, free and premium."}
        </Typography>
              </Card>
              <Grid container className="subs">
              <Grid item xs={6}>
                <Typography align="center">
                  { "Free users have access to all features but a limit of 8 of each item at one time - 8 clients, 8 jobs, etc."}
                  </Typography>
              </Grid>
              <Card>
                <Typography paragraph>
                {"Premium users have access to all features with an unlimited number of jobs, clients, and so on. We offer our premium subscription at two different rates - a monthly fee of 99¢ or a yearly fee of $9.99."} 
                </Typography>
                </Card>
                </Grid>
                <Card>
                  <Typography paragraph>
                 {"Choose your rate to subscribe and begin using your premium access!"}
                 </Typography>
                </Card> 

        <React.Fragment>
          <FormControlLabel
            control={
              <Checkbox
                price={999}
                name="subscription"
                onClick={this.setSubscriptionType}
                value="year"
                type="radio"
                color="secondary"
              />
            }
            label="Yearly Subscription - $9.99"
          />
          <FormControlLabel
            control={
              <Checkbox
                price={99}
                name="subscription"
                onClick={this.setSubscriptionType}
                value="month"
                type="radio"
                color="secondary"
              />
            }
            label="Monthly Subscription - 99¢"
          />
         
        <StripeCheckout
          amount={this.state.subscriptionAmount}
          currency='USD'
          name="contractAlchemy"
          stripeToken={this.getStripeToken}
          stripeKey="pk_test_4kN2XG1xLysXr0GWDB07nt61"
          image="https://bestpos.netlify.com/goldraccoon.png"
          color="black"
          zipCode="true"
          billingAddress="true"
          />
        </React.Fragment>
      </div>
    );
  }
}

export default Checkout;
