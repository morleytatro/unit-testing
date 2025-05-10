/**
 * Extension
 * 
 * Build a useQuery hook (push yourself to write tests first):
 * - It should take in an options object
 * - The options object has the `queryKey`, `queryFn`, and optionally `enabled`
 * - The queryKey is an array of strings/objects used for caching
 * - The queryFn is a function that returns a promise
 * - The enabled option is a boolean that determines if the query should run
 * - The hook should return the data, error (if present), and isLoading state
 * - When the hook is called, it should return the data if in the cache, and kick off the queryFn if enabled
 * - If the query is not enabled, it should return undefined for data and error
 * - You'll need to serialize the queryKey to use it as a cache key
 * 
 * If you're really feeling ambitious, you can also build a useMutation hook.
 * Plan out the tests prior to building for TDD practice.
 */