## Why?

Because we got tired of fighting with CI software and forcing it to do what we wanted. In the end we docker-ise everything, so why not manage the build process on our own.

## How?

Pubsub model at the core. Http server to allow for external calls. Adapters that emit and subscribe to central.

## Adapters?

Adapters provide I/O into the system. Each can either subscribe to events emitted from the core, or emit own events. There is also a possibility to attach to core http server and expose an API for remote control.

## Events

We currently recognise and support following events:

 - commit
 - pull_request
 - build_started
 - build_finished

