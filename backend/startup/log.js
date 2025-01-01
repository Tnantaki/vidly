import morgan from "morgan"; // for logger
import debug from "debug"; // display log

export default function(app) {
  // Create a debugger instance with a namespace
  const log = debug('app:startup');

  // Enable the debugger (this can also be set through the DEBUG environment variable)
  debug.enable('app:*');

  // if process.env.NODE_ENV is undefined app.get('env') will set to 'development'
  if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    log('Morgan enabled...')
  }
}