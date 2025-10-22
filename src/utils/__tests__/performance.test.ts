import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, throttle, memoize, deepEqual } from '../performance'

describe('Debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should delay function execution', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('test')
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('should cancel previous calls', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('call1')
    vi.advanceTimersByTime(100)
    
    debouncedFn('call2')
    vi.advanceTimersByTime(100)
    
    debouncedFn('call3')
    vi.advanceTimersByTime(300)

    // Должен быть вызван только последний раз
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call3')
  })

  it('should work with multiple arguments', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('arg1', 'arg2', 'arg3')
    vi.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })
})

describe('Throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should execute function immediately on first call', () => {
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 1000)

    throttledFn('test')
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('should ignore calls within limit period', () => {
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 1000)

    throttledFn('call1')
    throttledFn('call2')
    throttledFn('call3')

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call1')
  })

  it('should allow call after limit period', () => {
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 1000)

    throttledFn('call1')
    expect(mockFn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1000)

    throttledFn('call2')
    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn).toHaveBeenCalledWith('call2')
  })
})

describe('Memoize', () => {
  it('should cache function results', () => {
    const expensiveFn = vi.fn((n: number) => n * 2)
    const memoizedFn = memoize(expensiveFn)

    const result1 = memoizedFn(5)
    const result2 = memoizedFn(5)

    expect(result1).toBe(10)
    expect(result2).toBe(10)
    expect(expensiveFn).toHaveBeenCalledTimes(1) // Кэш сработал
  })

  it('should call function for different arguments', () => {
    const expensiveFn = vi.fn((n: number) => n * 2)
    const memoizedFn = memoize(expensiveFn)

    memoizedFn(5)
    memoizedFn(10)
    memoizedFn(5)

    expect(expensiveFn).toHaveBeenCalledTimes(2) // 5 и 10
  })

  it('should work with custom resolver', () => {
    const expensiveFn = vi.fn((obj: { id: number; name: string }) => obj.id * 2)
    const memoizedFn = memoize(expensiveFn, (obj) => String(obj.id))

    memoizedFn({ id: 5, name: 'test1' })
    memoizedFn({ id: 5, name: 'test2' }) // Разные объекты, но одинаковый id

    expect(expensiveFn).toHaveBeenCalledTimes(1) // Кэш по id
  })

  it('should handle multiple arguments', () => {
    const sumFn = vi.fn((a: number, b: number) => a + b)
    const memoizedSum = memoize(sumFn)

    memoizedSum(2, 3)
    memoizedSum(2, 3)
    memoizedSum(3, 2) // Другой порядок аргументов

    expect(sumFn).toHaveBeenCalledTimes(2) // [2,3] и [3,2]
  })
})

describe('Deep Equal', () => {
  it('should return true for primitive values', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual('test', 'test')).toBe(true)
    expect(deepEqual(true, true)).toBe(true)
    expect(deepEqual(null, null)).toBe(true)
  })

  it('should return false for different primitive values', () => {
    expect(deepEqual(1, 2)).toBe(false)
    expect(deepEqual('test', 'Test')).toBe(false)
    expect(deepEqual(true, false)).toBe(false)
  })

  it('should compare simple objects', () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
  })

  it('should compare nested objects', () => {
    const obj1 = { a: 1, b: { c: 2, d: { e: 3 } } }
    const obj2 = { a: 1, b: { c: 2, d: { e: 3 } } }
    const obj3 = { a: 1, b: { c: 2, d: { e: 4 } } }

    expect(deepEqual(obj1, obj2)).toBe(true)
    expect(deepEqual(obj1, obj3)).toBe(false)
  })

  it('should compare arrays', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
    expect(deepEqual([1, 2, 3], [1, 3, 2])).toBe(false)
  })

  it('should handle null and undefined', () => {
    expect(deepEqual(null, null)).toBe(true)
    expect(deepEqual(undefined, undefined)).toBe(true)
    expect(deepEqual(null, undefined)).toBe(false)
    expect(deepEqual({}, null)).toBe(false)
  })

  it('should compare objects with arrays', () => {
    const obj1 = { items: [1, 2, 3], name: 'test' }
    const obj2 = { items: [1, 2, 3], name: 'test' }
    const obj3 = { items: [1, 2], name: 'test' }

    expect(deepEqual(obj1, obj2)).toBe(true)
    expect(deepEqual(obj1, obj3)).toBe(false)
  })
})

