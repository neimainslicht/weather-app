import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWeather } from '../hooks/useWeather';
import { fetchCityList } from '../services/geoCodingApi';
import { fetchWeather } from '../services/weatherApi';

vi.mock('../services/geoCodingApi');
vi.mock('../services/weatherApi');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_CITIES = [
  { id: 1, name: 'London', lat: 51.5, lon: -0.12 },
  { id: 2, name: 'London, Ontario', lat: 42.98, lon: -81.24 },
];

const MOCK_WEATHER = {
  temp: 18,
  condition: 'Partly Cloudy',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolves(value) {
  return vi.fn().mockResolvedValue(value);
}

function rejects(message) {
  return vi.fn().mockRejectedValue(new Error(message));
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it('returns correct initial state', () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.locations).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.weather).toBeNull();
    expect(result.current.condition).toBeNull();
  });

  // ── searchCity — happy path ────────────────────────────────────────────────

  it('searchCity: sets locations on success', async () => {
    fetchCityList.mockImplementation(resolves(MOCK_CITIES));
    const { result } = renderHook(() => useWeather());

    act(() => { result.current.searchCity('London'); });

    // loading is true while the promise is in-flight
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.locations).toEqual(MOCK_CITIES);
    expect(result.current.error).toBeNull();
  });

  it('searchCity: clears previous weather before fetching', async () => {
    // Arrange: prime weather state first via a successful searchWeather call
    fetchWeather.mockImplementation(resolves(MOCK_WEATHER));
    fetchCityList.mockImplementation(resolves(MOCK_CITIES));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.searchWeather(51.5, -0.12));
    expect(result.current.weather).toEqual(MOCK_WEATHER);

    // Act: now search a city — weather should be wiped immediately
    act(() => { result.current.searchCity('London'); });
    expect(result.current.weather).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('searchCity: clears error from a previous failed call', async () => {
    fetchCityList
      .mockImplementationOnce(rejects('Network error'))
      .mockImplementationOnce(resolves(MOCK_CITIES));

    const { result } = renderHook(() => useWeather());

    // First call — fails
    await act(() => result.current.searchCity('London'));
    expect(result.current.error).toBe('Network error');

    // Second call — succeeds; error must be cleared
    await act(() => result.current.searchCity('London'));
    expect(result.current.error).toBeNull();
  });

  // ── searchCity — error path ────────────────────────────────────────────────

  it('searchCity: sets error and clears locations on failure', async () => {
    fetchCityList.mockImplementation(rejects('Network error'));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.searchCity('???'));

    expect(result.current.error).toBe('Network error');
    expect(result.current.locations).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.weather).toBeNull();
  });

  // ── searchWeather — happy path ─────────────────────────────────────────────

  it('searchWeather: sets weather and condition on success', async () => {
    fetchWeather.mockImplementation(resolves(MOCK_WEATHER));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.searchWeather(51.5, -0.12));

    expect(result.current.weather).toEqual(MOCK_WEATHER);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('searchWeather: strips whitespace from condition', async () => {
    fetchWeather.mockImplementation(resolves({ ...MOCK_WEATHER, condition: 'Partly Cloudy' }));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.searchWeather(51.5, -0.12));

    expect(result.current.condition).toBe('PartlyCloudy');
  });

  it('searchWeather: handles condition with multiple internal spaces', async () => {
    fetchWeather.mockImplementation(resolves({ ...MOCK_WEATHER, condition: 'Heavy  Rain  Storm' }));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.searchWeather(51.5, -0.12));

    expect(result.current.condition).toBe('HeavyRainStorm');
  });

  it('searchWeather: clears locations after a successful fetch', async () => {
    fetchCityList.mockImplementation(resolves(MOCK_CITIES));
    fetchWeather.mockImplementation(resolves(MOCK_WEATHER));
    const { result } = renderHook(() => useWeather());

    // Populate locations first
    await act(() => result.current.searchCity('London'));
    expect(result.current.locations).toEqual(MOCK_CITIES);

    // Fetching weather must clear them (in finally block)
    await act(() => result.current.searchWeather(51.5, -0.12));
    expect(result.current.locations).toEqual([]);
  });

  // ── searchWeather — error path ─────────────────────────────────────────────

  it('searchWeather: sets error and nulls weather on failure', async () => {
    fetchWeather.mockImplementation(rejects('Timeout'));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.searchWeather(999, 999));

    expect(result.current.error).toBe('Timeout');
    expect(result.current.weather).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('searchWeather: still clears locations even when fetch fails', async () => {
    fetchCityList.mockImplementation(resolves(MOCK_CITIES));
    fetchWeather.mockImplementation(rejects('Timeout'));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.searchCity('London'));
    await act(() => result.current.searchWeather(999, 999));

    // finally block runs regardless of error
    expect(result.current.locations).toEqual([]);
  });

  // ── Edge cases ─────────────────────────────────────────────────────────────

  it('searchCity: works with an empty result list', async () => {
    fetchCityList.mockImplementation(resolves([]));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.searchCity('Xyzzy'));

    expect(result.current.locations).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('searchWeather: condition with no spaces remains unchanged', async () => {
    fetchWeather.mockImplementation(resolves({ ...MOCK_WEATHER, condition: 'Sunny' }));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.searchWeather(51.5, -0.12));

    expect(result.current.condition).toBe('Sunny');
  });
});