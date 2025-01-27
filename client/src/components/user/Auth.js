import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import Card from "../shared/components/UIElements/Card";
import Input from "../shared/components/FormElements/Input";
import Button from "../shared/components/FormElements/Button";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from "../shared/util/validators";
import { useForm } from "../shared/hooks/form-hook";
import { AuthContext } from "../shared/context/auth-context";
import "./Auth.css";
import MessageHeader from "../shared/components/MessageHeader";

function Auth() {
  const auth = useContext(AuthContext);
  let history = useHistory();

  const trip = auth.trip;

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false
      },
      password: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    console.log("stored trip object at sign up submit", trip);

    event.preventDefault();

    setIsLoading(true);

    if (isLoginMode) {
      try {
        const token = auth.token;
        const response = await fetch("https://travelistmakers.herokuapp.com/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "bearer " + auth.token
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log(responseData);
        setIsLoading(false);
        auth.login(responseData.userId, responseData.name, responseData.token);
        history.push("/trips");
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Something went wrong, please try again.");
      }
    } else {
      try {
        const response = await fetch("https://travelistmakers.herokuapp.com/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            trips: [trip]
          })
        });

        const responseData = await response.json();
        console.log("Sign up response data", responseData);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        auth.login(responseData.userId, responseData.name, responseData.token);
        history.push("/trips");
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Something went wrong, please try again.");
      }
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <MessageHeader
        message="Who are you, friend?"
        image="./images/casie4.png"
      />
      <Card className="authentication ">
        <div className="card-body ">
          {isLoading && <LoadingSpinner asOverlay />}
          <form onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name."
                onInput={inputHandler}
              />
            )}
            <Input
              element="input"
              id="email"
              type="email"
              label="E-mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid password, at least 5 characters."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? "LOG IN" : "SIGN UP"}
            </Button>
          </form>
          <Button inverse onClick={switchModeHandler}>
            {isLoginMode ? "SIGN UP" : "LOG IN"}
          </Button>
        </div>
      </Card>
    </React.Fragment>
  );
}

export default Auth;
