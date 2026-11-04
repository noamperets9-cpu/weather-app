import { describe, expect, it } from 'vitest'
import { getWeatherInfo } from './weatherCodes'

describe('getWeatherInfo', () => {
  it('קוד 0 הוא שמיים בהירים', () => {
    expect(getWeatherInfo(0)).toEqual({ condition: 'clear', description: 'בהיר', icon: '☀️' })
  })

  it('קודי ערפל (45, 48) מסווגים כערפל', () => {
    expect(getWeatherInfo(45).condition).toBe('fog')
    expect(getWeatherInfo(48).condition).toBe('fog')
  })

  it('טפטוף, גשם וממטרים — כולם בקבוצת "גשם" (בשביל הסינון)', () => {
    expect(getWeatherInfo(51).condition).toBe('rain') // טפטוף
    expect(getWeatherInfo(63).condition).toBe('rain') // גשם
    expect(getWeatherInfo(81).condition).toBe('rain') // ממטרים
  })

  it('קודים 95–99 הם סופת רעמים', () => {
    expect(getWeatherInfo(95).description).toBe('סופת רעמים')
    expect(getWeatherInfo(99).condition).toBe('storm')
  })

  it('קוד לא מוכר לא קורס ומחזיר "לא ידוע"', () => {
    expect(getWeatherInfo(1234).description).toBe('לא ידוע')
  })
})
