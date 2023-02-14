type EventNames = 'toast_show' | 'toast_clear';

type ListenerType = (...args: any[]) => void;

class ToastEvent {
  private listenerObj: { [key in EventNames]: ListenerType } | {} = {};
  public trigger(eventName: EventNames, ...args: any[]) {
    this.listenerObj[eventName]?.(...args);
  }
  public on(eventName: EventNames, listener: ListenerType) {
    this.listenerObj[eventName] = listener;
  }
  public off(eventName: EventNames, listener?: ListenerType) {
    if (this.listenerObj[eventName] === listener) {
      delete this.listenerObj[eventName];
    }
  }
}

const events = new ToastEvent();

function trigger(eventName: EventNames, ...args: any[]) {
  return events.trigger(eventName, ...args);
}

function on(eventName: EventNames, listener: ListenerType) {
  return events.on(eventName, listener);
}

function off(eventName: EventNames, listener?: ListenerType) {
  return events.off(eventName, listener);
}

export { on, off, trigger };
