import { throttle, ExecutionEdge } from "../../../dist/out-tsc/lib/super-throttle";

import React, { useReducer } from "react";

export function App() {
	const [_, forceUpdate] = useReducer((x) => x + 1, 0);
	const cooldownRef = React.useRef<HTMLInputElement>(null);
	const [executionEdge, setExecutionEdge] = React.useState<ExecutionEdge>("both");
	const [mode, setMode] = React.useState<"throttle" | "debounce">("throttle");
	const [cooldown, setCooldown] = React.useState(1000);
	const [infiniteCooldown, setInfiniteCooldown] = React.useState(false);
	const handleClick = React.useCallback(() => {
		// Some expensive operation
		console.log("Clicked!");
	}, []);
	const throttledClick = React.useMemo(
		() =>
			throttle(handleClick, {
				cooldownMs: infiniteCooldown ? Number.POSITIVE_INFINITY : cooldown,
				mode,
				executionEdge,
			}),
		[handleClick, cooldown, infiniteCooldown, mode, executionEdge],
	);
	const onClick = React.useCallback(() => {
		throttledClick?.();
		forceUpdate();
	}, [throttledClick]);
	const onCooldownComplete = React.useCallback(() => {
		forceUpdate();
	}, [throttledClick, forceUpdate]);
	throttledClick.onCooldownComplete(onCooldownComplete);
	const onChangeCooldown = React.useCallback((e: React.FormEvent) => {
		if (e.target instanceof HTMLInputElement) {
			setCooldown(parseInt(e.target.value, 10));
		}
	}, []);
	const infinityCheckboxChange = React.useCallback((e: React.FormEvent) => {
		setInfiniteCooldown(e.target instanceof HTMLInputElement && e.target.checked);
	}, []);
	const onThrottleChange = React.useCallback((e: React.FormEvent) => {
		if (e.target instanceof HTMLInputElement) {
			if (e.target.checked) {
				setMode("throttle");
			}
		}
	}, []);
	const onDebounceChange = React.useCallback((e: React.FormEvent) => {
		if (e.target instanceof HTMLInputElement) {
			if (e.target.checked) {
				setMode("debounce");
			}
		}
	}, []);
	const onLeadingEdgeChange = React.useCallback((e: React.FormEvent) => {
		if (e.target instanceof HTMLInputElement && e.target.checked) {
			setExecutionEdge("leading");
		}
	}, []);
	const onTrailingEdgeChange = React.useCallback((e: React.FormEvent) => {
		if (e.target instanceof HTMLInputElement && e.target.checked) {
			setExecutionEdge("trailing");
		}
	}, []);
	const onBothEdgeChange = React.useCallback((e: React.FormEvent) => {
		if (e.target instanceof HTMLInputElement && e.target.checked) {
			setExecutionEdge("both");
		}
	}, []);
	const stats = throttledClick.getStats();
	return (
		<div>
			<header className="py-6 bg-gunmetal-900">
				<h1 className="font-bold max-w-2xl m-auto">Super Throttle</h1>
			</header>
			<main className="max-w-3xl p-8 m-auto bg-gunmetal-800">
				<p>
					This library exports a function, <code>throttle</code>, which reduces the number of calls to a given
					function. In the demo below, the <strong>Click me</strong> button's click handler is throttled based
					on the selected settings.
				</p>
				<p>
					<strong>Clicks</strong> shows how many times the button has been clicked, while{" "}
					<strong>Invocations</strong> shows how many times the click handler has executed.
				</p>
				<h2 className="mt-3">Demo</h2>
				<div className="w-full mb-4 flex flex-col space-y-3">
					<div className="">
						<h3>Mode</h3>
						<input
							type="radio"
							onChange={onThrottleChange}
							checked={mode === "throttle"}
							className="mr-1"
							id="throttleRadio"
						/>
						<label htmlFor="throttleRadio">Throttle</label>
						<input
							type="radio"
							onChange={onDebounceChange}
							checked={mode === "debounce"}
							className="ml-4 mr-1"
							id="debounceRadio"
						/>
						<label htmlFor="debounceRadio">Debounce</label>
					</div>
					<div>
						<h3>Invoke on...</h3>
						<input
							type="radio"
							onChange={onLeadingEdgeChange}
							checked={executionEdge === "leading"}
							className="mr-1"
							id="leadingEdgeRadio"
						/>
						<label htmlFor="leadingEdgeRadio">Leading edge</label>
						<input
							type="radio"
							onChange={onTrailingEdgeChange}
							checked={executionEdge === "trailing"}
							className="ml-4 mr-1"
							id="trailingEdgeRadio"
						/>
						<label htmlFor="trailingEdgeRadio">Trailing edge</label>
						<input
							type="radio"
							onChange={onBothEdgeChange}
							checked={executionEdge === "both"}
							className="ml-4 mr-1"
							id="bothRadio"
						/>
						<label htmlFor="bothRadio">Both</label>
					</div>

					<div>
						<h3 className="mb-2">Cooldown (ms)</h3>
						<input
							type="text"
							ref={cooldownRef}
							className="w-16 text-center rounded-sm disabled:opacity-40"
							onChange={onChangeCooldown}
							value={cooldown}
							disabled={infiniteCooldown}
						/>
						<input
							type="checkbox"
							className="ml-4"
							onChange={infinityCheckboxChange}
							checked={infiniteCooldown}
							id="infinityCheckbox"
						/>{" "}
						<label htmlFor="infinityCheckbox">infinity</label>
					</div>
				</div>

				<div>
					<div className="mb-4 flex justify-center">
						<button className="px-6 py-3 mt-4 text-xl" onClick={onClick}>
							Click me
						</button>
					</div>
					<div className="flex justify-center space-x-3">
						<div className="mb-2">
							<button
								onClick={() => {
									throttledClick.clearCooldown();
									forceUpdate();
								}}
							>
								Clear cooldown
							</button>
						</div>
						<div className="mb-2">
							<button
								onClick={() => {
									throttledClick.resetCooldown();
									forceUpdate();
								}}
							>
								Restart cooldown
							</button>
						</div>
						<div className="mb-2">
							<button
								onClick={() => {
									throttledClick.forceFunctionCall();
									forceUpdate();
								}}
							>
								Force function call
							</button>
						</div>
						<div className="mb-2">
							<button
								onClick={() => {
									stats.reset();
									forceUpdate();
								}}
							>
								Reset stats
							</button>
						</div>
					</div>
					<div className="flex justify-between mt-3">
						<div className="basis-1/12">
							<div>Clicks</div>
							<div>{stats.invocations}</div>
						</div>
						<div className="basis-1/6">
							<div>Invocations</div>
							<div>{stats.executions}</div>
						</div>
						<div className="basis-1/6">
							<div>Cooling down</div>
							<div>{String(stats.isCoolingDown)}</div>
						</div>
						<div className="basis-3/12">
							<div>Invocation queued</div>
							<div>{String(stats.queuedInvocation)}</div>
						</div>
						<div className="basis-1/6">
							<div>Last click</div>
							<div>{stats.lastInvoked?.toLocaleTimeString() ?? "none"}</div>
						</div>
						<div className="basis-1/6">
							<div>Last invocation</div>
							<div>{stats.lastExecuted?.toLocaleTimeString() ?? "none"}</div>
						</div>
					</div>
					<div className="mt-4">
						<h2 className="mb-3">Documentation</h2>
						<p className="text-xl">
							See the <a href="/super-throttle/api">Generated API Docs</a>.
						</p>
						<div className="my-3">
							<h3 className="mb-3">ThrottleSettings</h3>
							<h4>
								<code>mode: "throttle"</code>
							</h4>
							<p>
								In <strong>throttle</strong> mode, the cooldown period only gets set when the underlying
								function is executed. If the call to the throttled function does not result in calling
								the underlying function, the cooldown period does not get reset.
							</p>
							<h4 className="mt-3">
								<code>mode: "debounce"</code>
							</h4>
							<p>
								In <strong>debounce</strong> mode, each time the throttled function is called, the
								cooldown period is reset. Therefore, in order for the underlying function to be called,
								the throttled function must not be called for at least as long as the cooldown period.
							</p>
							<h4 className="mt-3">
								<code>executionEdge: "leading"</code>
							</h4>
							<p>
								When <code>executionEdge</code> is set to <code>"leading"</code>, the underlying
								function will be called immediately when the throttled function is called with no
								cooldown in progress.
							</p>
							<h4 className="mt-3">
								<code>executionEdge: "trailing"</code>
							</h4>
							<p>
								When <code>executionEdge</code> is set to <code>"trailing"</code>, the underlying
								function will be called immediately after the cooldown expires.
							</p>
							<h4 className="mt-3">
								<code>executionEdge: "both"</code>
							</h4>
							<p>
								If <code>executionEdge</code> is set to <code>"both"</code>, execution <em>can</em>{" "}
								occur on both sides of the cooldown period. However, the trailing function is only
								executed if the there is an invocation of the throttled function that has not already
								caused a function execution. In other words, a single invocation of the throttled
								function will only ever result in a single invocation of the underlying function.
							</p>
						</div>
						<div>
							<h3>Recipes for common use cases</h3>
							<h4>Handling noisy events</h4>
							<p>
								Sometimes events are noisy, so if you are doing expensive work, such as manipulating the
								DOM, in your event handler, you may want to throttle the handler to avoid doing a lot of
								unnecessary work.
							</p>
							<p>
								The default settings for <code>throttle</code> handle this scenario out of the box. The{" "}
								<code>cooldown</code> period is set to 100ms <code>mode</code> to{" "}
								<code>"throttle"</code>, and <code>executionEdge</code> is set to <code>"both"</code> so
								that the first and last events are always guaranteed to be handled.
							</p>
							<p>
								<code className="whitespace-pre-wrap">
									{`const eventHandler = (ev: MouseEvent) => { /* ... */ };
const throttledEventHandler = throttle(eventHandler);
window.addEventListener("mousemove", throttledEventHandler);`}
								</code>
							</p>

							<h4 className="mt-3">Server-side autocomplete</h4>
							<p>
								Because autocomplete results may not be relevant until the user pauses typing, we want
								to avoid making any requests until we see this pause. This is the perfect situation for{" "}
								<code>mode: "debounce"</code>. Also, we only want to make the server call on the
								trailing edge of the cooldown since the autocomplete results for a single keystroke
								likely won't be relevant.
							</p>
							<p>
								<code className="whitespace-pre-wrap">
									{`const getResultsThrottled = throttle(
	getAutocompleteResults, {
		cooldown: 250,
		mode: "throttle",
		executionEdge: "trailing"
	};
);
someInput.addEventListener("input", getResultsThrottled);`}
								</code>
							</p>
							<h4 className="mt-3">Prevent multiple form submissions</h4>
							<p>
								Even though we can't define a <code>cooldown</code> period for this scenario, we can
								still use <code>throttle</code>. Simply pass <code>Number.POSITIVE_INFINITY</code> as
								the cooldown period and it will never cool down naturally. Of course, we can re-enable
								it by using <code>.clearCooldown()</code> on the returned <code>ThrottledFunction</code>
								.
							</p>
							<p>
								<code className="whitespace-pre-wrap">
									{`const form = document.getElementById("myForm");
const submitButton = form.querySelector("input[type=submit]");
const handleSubmit = (event: FormEvent) => { 
	// ...
	submitButton.disabled = true;
};
const onlySubmitOnce = throttle(
	handleSubmit, 
	{ cooldown: Number.POSITIVE_INFINITY, executionEdge: "leading" }
);
form.addEventListener("submit", onlySubmitOnce);

// Re-enabling the submit button is coupled with the cooldown
onlySubmitOnce.onCooldownComplete(() => {
	submitButton.disabled = false;
});

// There may be situations where it's desirable to re-enable submits.
function enableForm() {
	// This enables another submission AND re-enables the submit button!
	onlySubmitOnce.clearCooldown();
}
`}
								</code>
							</p>
						</div>
					</div>
				</div>
			</main>
			<footer className="py-6 bg-gunmetal-900 text-center">
				<p>
					View on <a href="https://github.com/T-Hugs/super-throttle">GitHub</a> |{" "}
					<a href="https://npmjs.com/package/super-throttle">npm</a>
				</p>
				<p>Created by Trevor Gau</p>
			</footer>
		</div>
	);
}

export default App;
