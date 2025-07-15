
# Honeycomb Academy: Sample React MeminatorOld App 

***This is a demo app, don't run it in production.***

This contains a sample React application called MeminatorOld for use in Honeycomb Academy lab activities. This app was converted from a backend Node.js web application into a dynamic React frontend that connects to 3 backend services.

The app creates memes by combining randomly selected images with either randomly generated phrases or custom text that you provide.

## Introduction

Hello! Welcome to the **Instrumenting with Browser** lab.

1. Take a look at this app. The React frontend needs to be instrumented.
2. Before you can do that, you need to run this app.
3. Then, connect this app to Honeycomb.
4. See what the traces look like.
5. Improve the traces to see end-to-end, fullstack traces.

## Running the application

To run this app, you can use GitPod or Codespaces. Note that Gitpod and Codespaces are free up to a certain number of hours per month.

Once you run the application, you can send traces to Honeycomb. Then you can practice improving the instrumentation for better observability.

### GitHub Codespaces setup

Open the repository on GitHub. Open the `<> Code` dropdown down menu.

Select the `Codespaces` tab. Create a codespace on main.

### GitPod setup

Go to [Gitpod](https://gitpod.io/#https://github.com/honeycombio/academy-instrumentation-nodejs) to open the repository.

Confirm the workspace creation. You can work in the browser with VS Code Browser or in your local code editor. The default settings are acceptable.

Once you are in the code editor, run `docker compose up` in the code editor's terminal. To stop running the application, run `ctrl+c`. Then run `docker compose down` to remove the container.

### One-time setup

You also have the option to run this application locally.

First, clone this repository.

```bash
git clone https://github.com/honeycombio/academy-instrumentation-browser
```

Install Docker: https://docs.docker.com/get-docker/

### Run the app

`./run`

(This will run `docker compose` in daemon mode, and build containers.)

Access the app:

[http://localhost:10114](http://localhost:10114)

After making changes to a service, you can tell it to rebuild just that one:

`./run [ meminator | backend-for-frontend | image-picker | phrase-picker ]`

### Try it out

Visit [http://localhost:10114](http://localhost:10114)

Click the "GO" button. Then wait. Click "CREATE YOUR OWN MEME" button. Type a phrase. Click the "GO" button. 

### Stop the app

`./stop`
