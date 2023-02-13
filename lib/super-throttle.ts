/**
 * These settings control the behavior of the throttle function.
 */
export interface ThrottleSettings {
	/**
	 * Number of milliseconds to wait between function calls. If the cooldown
	 * should never expire, use `Number.POSITIVE_INFINITY`.
	 *
	 * @defaultValue `100`
	 */
	cooldownMs: number;

	/**
	 * The behavior for when the function is called during the
	 * cooldown period.
	 *
	 * `"throttle"` - Ignore the call and do not reset the cooldown period.
	 *              This is used to implement typical "throttle" behavior.
	 *
	 * `"debounce"` - Reset the cooldown period.
	 *
	 * @defaultValue `"throttle"`
	 */
	mode: "throttle" | "debounce";

	/**
	 * Specify which side of the cooldown period the underlying function
	 * is allowed to be executed.
	 *
	 * `"leading"`  - the underlying function is called immediately when the
	 *              throttled function is invoked with no cooldown in effect.
	 *
	 * `"trailing"` - the underlying function is queued to be called as soon as
	 *              the cooldown is complete.
	 *
	 * `"both"`     - the underlying function is called immediately when the
	 *              throttled function is invoked with no cooldown in effect.
	 *              If the throttled function is invoked during the cooldown,
	 *              queues the underlying function to be called when the
	 *              cooldown is over.
	 *
	 * @defaultValue `"both"`
	 */
	executionEdge: "leading" | "trailing" | "both";
}

export interface ForceFunctionCallSettings<TArgs extends unknown[]> {
	/**
	 * Custom args to pass to the function. If undefined, we will pass
	 * any previously given args, if they exist. If you want to pass
	 * undefined/nothing, use [].
	 */
	customArgs?: TArgs;

	/**
	 * Whether or not to reset the cooldown for the underlying timer.
	 *
	 * @defaultValue `true`
	 */
	resetCooldown?: boolean;

	/**
	 * Whether or not to clear any queued invocations for the underlying
	 * throttle.
	 *
	 * @defaultValue `true`
	 */
	clearQueuedInvocation?: boolean;
}

/**
 * Statistics for a ThrottledFunction
 */
export interface ThrottledFunctionStats {
	/**
	 * The current cooldown period, in milliseconds
	 */
	cooldownMs: number;

	/**
	 * The number of times the underlying function has actually executed
	 */
	executions: number;

	/**
	 * The number of times the throttled function has been called
	 */
	invocations: number;

	/**
	 * Whether or not the ThrottledFunction is in a cooldown period
	 */
	isCoolingDown: boolean;

	/**
	 * The time the underlying function was last executed
	 */
	lastExecuted: Date | undefined;

	/**
	 * The time the throttled function was last called
	 */
	lastInvoked: Date | undefined;

	/**
	 * Whether or not an invocation is currently queued for when the
	 * cooldown period ends.
	 */
	queuedInvocation: boolean;

	/**
	 * Resets all stats for the throttled function. Does not alter
	 * the behavior of the throttled function outside future calls
	 * to getStats().
	 * @returns
	 */
	reset: () => void;
}

export type ExecutionEdge = "leading" | "trailing" | "both";

export type CooldownCompleteCallback<TArgs extends unknown[], TReturn> = (
	throttledFunction: ThrottledFunction<TArgs, TReturn>,
) => void | boolean;

export interface ThrottledFunction<TArgs extends unknown[], TReturn> {
	/**
	 * Clears the current cooldown. If `suppressQueuedInvocation` is `true`,
	 * ignore/clear any queued invocation.
	 *
	 * Note: If there is a queued invocation and it is not suppressed, the
	 * underlying function will be executed and the cooldown will restart.
	 *
	 * @param suppressQueuedInvocation
	 */
	clearCooldown: (suppressQueuedInvocation?: boolean) => void;

	/**
	 * Clears the currently-queued invocation, if any.
	 */
	clearQueuedInvocation: () => void;

	/**
	 * Force calling the underlying function, bypassing the cooldown.
	 *
	 * Note: by default, calling this function will restart the cooldown period
	 * and clear any queued invocations. See `ForceFunctionCallSettings` to change
	 * this behavior.
	 *
	 * @param args
	 * @returns The return value of the underlying function
	 */
	forceFunctionCall: (settings?: ForceFunctionCallSettings<TArgs>) => TReturn;

	/**
	 * Gets the internal handle for the current cooldown timeout. Use with caution!
	 *
	 * @returns `undefined` if there is no active cooldown.
	 * @returns `true` if the active cooldown is set to Infinity
	 * @returns a handle to the active cooldown timer.
	 */
	getCooldownHandle: () => ReturnType<typeof globalThis.setTimeout> | true | undefined;

	/**
	 * Gets the most recent return value of the underlying function. If the function
	 * has not yet been called, returns undefined.
	 */
	getReturnValue: () => TReturn | undefined;

	/**
	 * Gets stats about the ThrottledFunction
	 */
	getStats: () => ThrottledFunctionStats;

	/**
	 * Returns true if the throttled function is currently in a cooldown state
	 */
	isCoolingDown: () => boolean;

	/**
	 * Unregister a cooldown complete callback
	 * @param callback
	 */
	offCooldownComplete: (callback: CooldownCompleteCallback<TArgs, TReturn>) => void;

	/**
	 * Register a callback that is executed each time the cooldown ends. Return
	 * a boolean to force calling (`true`) or not calling (`false`) the underlying
	 * function, regardless of whether or not an invocation is queued.
	 *
	 * If multiple callbacks return competing true/false values, the behavior is
	 * undefined.
	 * @param callback
	 */
	onCooldownComplete: (callback: CooldownCompleteCallback<TArgs, TReturn>) => void;

	/**
	 * Reference to the unmodified raw function. If this is called, it will not affect
	 * any cooldowns or queued invocations.
	 * @param args
	 */
	rawFunction: (...args: TArgs) => TReturn;

	/**
	 * Resets/sets the throttled function into a fresh cooldown period. If
	 * `suppressQueuedInvocation` is `true`, ignore/clear any queued invocation.
	 *
	 * @param {boolean} [suppressQueuedInvocation=false]
	 */
	resetCooldown: (suppressQueuedInvocation?: boolean) => void;

	/**
	 * Sets args to be passed to the underlying function in subsequent calls.
	 * @param args
	 */
	setArgs: (...args: TArgs) => void;

	/**
	 * Sets the cooldown period. All future cooldowns AFTER the currently
	 * running cooldown will use the new cooldown period.
	 * @param ms
	 */
	setCooldownPeriod: (ms: number) => void;

	/**
	 * Sets a queued invocation for when the current cooldown period ends.
	 */
	setQueuedInvocation: () => void;

	/**
	 * Reference to the settings object for this throttled function with all defaults
	 * populated.
	 */
	throttleSettings: ThrottleSettings;

	/**
	 * Call the throttled function. Returns the value most recently-returned
	 * by the underlying function, or `undefined` if the function hasn't been called yet.
	 */
	(...args: TArgs): TReturn | undefined;
}

declare function setTimeout<TArgs extends unknown[]>(
	callback: (...args: TArgs) => void,
	ms?: number,
	...args: TArgs
): ReturnType<typeof globalThis.setTimeout>;

declare function clearTimeout(timerId: ReturnType<typeof globalThis.setTimeout>): void;

const defaultSettings: ThrottleSettings = {
	mode: "throttle",
	cooldownMs: 100,
	executionEdge: "both",
};

const defaultForceFunctionCallSettings: ForceFunctionCallSettings<unknown[]> = {
	clearQueuedInvocation: true,
	resetCooldown: true,
	customArgs: undefined,
};

/**
 * Reduces the number of calls to a given function. Can be used for "debouncing",
 * "throttling", as well as other common scenarios where we wish to restrict the
 * number of times a function can be called.
 *
 * This function can also be accessed like an object. This gives fine-grained control
 * over the cooldown behavior and more, allowing the user to manually clear or reset
 * the cooldown. As an example, this may be useful for implementing a throttle that waits
 * on an external dependency, such as a server response.
 *
 * @example
 * Basic usage
 * ```ts
 * let i = 1;
 * function originalFunction() {
 *     console.log(i++);
 * }
 * const throttledFunction = throttle(originalFunction, { cooldownMs: 500 });
 * throttledFunction(); // calls originalFunction immediately, starts the cooldown period
 * throttledFunction(); // cooldown in progress... queue a call for when it is complete
 * throttledFunction(); // call is already queued! Ignore.
 * throttledFunction(); // call is already queued! Ignore.
 * throttledFunction.clearCooldown(); // Force the cooldown to end, causing the queued call to execute.
 * throttledFunction(); // cooldown in progress... queue a call for when it is complete
 *
 * // output:
 * // 1
 * // 2
 * // <500ms passes>
 * // 3
 * ```
 *
 * @param fn
 * @param settings
 * @param args
 * @returns
 */
export function throttle<TArgs extends unknown[], TReturn>(
	fn: (...args: TArgs) => TReturn,
	settings: Partial<ThrottleSettings> = {},
): ThrottledFunction<TArgs, TReturn> {
	let args: TArgs;
	const defaultedSettings = { ...defaultSettings, ...settings };
	const { cooldownMs: _cooldown, mode, executionEdge } = defaultedSettings;
	let cooldown = _cooldown;
	if (typeof globalThis.setTimeout !== "function" || typeof globalThis.clearTimeout !== "function") {
		throw new Error(
			"Could not find setTimeout or clearTimeout function. This library is intended to run in either a NodeJS or a browser environment.",
		);
	}
	if (cooldown < 0) {
		throw new Error("Cooldown must be non-negative.");
	}
	let currentCooldown: ReturnType<typeof globalThis.setTimeout> | true | undefined;
	let queuedInvocation = false;
	let returnValue: TReturn | undefined = undefined;
	let executionCount = 0;
	let invocationCount = 0;
	let lastExecutionTime: Date | undefined = undefined;
	let lastInvokationTime: Date | undefined = undefined;
	const cooldownCompleteCallbacks: Set<(throttledFunction: ThrottledFunction<TArgs, TReturn>) => void> = new Set();

	// Clears any existing cooldowns and resets it
	function setCooldown() {
		if (currentCooldown && currentCooldown !== true) {
			clearTimeout(currentCooldown);
		}
		if (Number.isFinite(cooldown)) {
			currentCooldown = setTimeout(cooldownComplete, cooldown);
		} else {
			// true represents a timeout that will never naturally end.
			currentCooldown = true;
		}
	}
	function callUnderlyingFunction(clearQueuedInvocation = true, resetCooldown = true, customArgs: TArgs = args) {
		executionCount++;
		lastExecutionTime = new Date();
		returnValue = fn(...customArgs);
		if (clearQueuedInvocation) {
			queuedInvocation = false;
		}
		if (resetCooldown) {
			setCooldown();
		}
		return returnValue;
	}
	function cooldownComplete() {
		currentCooldown = undefined;
		let shouldCallFunction: boolean | undefined = undefined;
		for (const callback of cooldownCompleteCallbacks) {
			const callbackResult = callback(result);
			if (callbackResult !== undefined) {
				shouldCallFunction = callbackResult;
			}
		}
		if (shouldCallFunction === undefined) {
			shouldCallFunction = queuedInvocation;
		}
		if (shouldCallFunction) {
			callUnderlyingFunction();
		}
	}
	const result: ThrottledFunction<TArgs, TReturn> = (..._args: TArgs) => {
		args = _args;
		invocationCount++;
		lastInvokationTime = new Date();
		if (currentCooldown !== undefined) {
			if (executionEdge !== "leading") {
				queuedInvocation = true;
			}
			if (mode === "debounce") {
				setCooldown();
			}
		} else {
			if (executionEdge !== "trailing") {
				callUnderlyingFunction();
			} else {
				queuedInvocation = true;
				setCooldown();
			}
		}
		return returnValue;
	};
	result.clearCooldown = (suppressQueuedInvocation = false) => {
		if (currentCooldown) {
			if (currentCooldown !== true) {
				clearTimeout(currentCooldown);
			}
			if (suppressQueuedInvocation) {
				queuedInvocation = false;
			}
			cooldownComplete();
		}
	};
	result.clearQueuedInvocation = () => {
		queuedInvocation = false;
	};
	result.getCooldownHandle = () => {
		return currentCooldown;
	};
	result.forceFunctionCall = (settings: ForceFunctionCallSettings<TArgs> = {}) => {
		const defaultedFunctionCallSettings = {
			...defaultForceFunctionCallSettings,
			...settings,
		};
		const underlyingResult = callUnderlyingFunction(
			defaultedFunctionCallSettings.clearQueuedInvocation,
			defaultedFunctionCallSettings.resetCooldown,

			// @ts-expect-error satisfies? @todo
			defaultedFunctionCallSettings.customArgs,
		);
		if (defaultedFunctionCallSettings.clearQueuedInvocation) {
			queuedInvocation = false;
		}
		if (defaultedFunctionCallSettings.resetCooldown && currentCooldown) {
			setCooldown();
		}
		return underlyingResult;
	};
	result.isCoolingDown = () => {
		return currentCooldown !== undefined;
	};
	result.getReturnValue = () => {
		return returnValue;
	};
	result.getStats = () => {
		return {
			cooldownMs: cooldown,
			executions: executionCount,
			invocations: invocationCount,
			isCoolingDown: currentCooldown !== undefined,
			lastExecuted: lastExecutionTime,
			lastInvoked: lastInvokationTime,
			queuedInvocation,
			reset: () => {
				executionCount = 0;
				invocationCount = 0;
				lastExecutionTime = undefined;
				lastInvokationTime = undefined;
			},
		} as ThrottledFunctionStats;
	};
	result.offCooldownComplete = (callback: CooldownCompleteCallback<TArgs, TReturn>) => {
		cooldownCompleteCallbacks.delete(callback);
	};
	result.onCooldownComplete = (callback: CooldownCompleteCallback<TArgs, TReturn>) => {
		cooldownCompleteCallbacks.add(callback);
	};
	result.rawFunction = fn;
	result.resetCooldown = (suppressQueuedInvocation = false) => {
		if (suppressQueuedInvocation) {
			queuedInvocation = false;
		}
		if (queuedInvocation) {
			callUnderlyingFunction();
		} else {
			setCooldown();
		}
	};
	result.setCooldownPeriod = (ms: number) => {
		cooldown = ms;
	};
	result.setQueuedInvocation = () => {
		queuedInvocation = true;
	};
	result.setArgs = (..._args: TArgs) => {
		args = _args;
	};
	result.throttleSettings = defaultedSettings;
	return result;
}
