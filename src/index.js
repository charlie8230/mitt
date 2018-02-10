// @flow
// An event handler can take an optional event argument
// and should not return a value
type EventHandler = (event?: any, type: string) => void;
//	type WildCardEventHandler = (type: string, event?: any) => void;
type EventHandlerItem = {handler: EventHandler, priority: Number};
//	type EventHandlerItemWild = {handler: WildCardEventHandler, priority: Number};

// An array of all currently registered event handlers for a type
type EventHandlerList = Array<EventHandlerItem>;
//	type WildCardEventHandlerList = Array<EventHandlerItemWild>;
// A map of event types and their corresponding event handlers.
type EventHandlerMap = {
  [type: string]: EventHandlerList,
};

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
export default function mitt(all: EventHandlerMap) {
	all = all || {};

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @param {Number} priority determine which event fires first when there are multiple subscribers (could all be equal too)
		 * @memberOf mitt
		 */
		on(type: string, handler: EventHandler, priority:Number =0) {
			if (type === '*') priority = -1;
			(all[type] || (all[type] = [])).push({handler, priority});
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off(type: string, handler: EventHandler) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit(type: string, evt: any) {
			if(type!=='*') {
				(all[type] || []).slice().sort(a,b=>{
					return a.priority - b.priority;
				}).forEach((handler)=>{ handler(evt, type||'')});
			}
			(all['*'] || []).slice().forEach((handler)=>{ handler(evt, type||'')});
		}
	};
}
