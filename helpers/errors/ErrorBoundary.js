import React from "react"
import Layout from "@modules/layout/components/base/layout"
import Button from "@modules/common/components/button/button"
import H2 from "@modules/common/components/heading/h2"
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Layout>
          <H2>Произошла ошибка</H2>
          <Button
            onClick={() => this.setState({ hasError: false })}
          >
            Попробовать еще раз?
          </Button>
        </Layout>
      )
    }

    // Return children components in case of no error

    return this.props.children
  }
}

export default ErrorBoundary