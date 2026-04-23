import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './Cascader.module.css'

interface CascaderOption {
  value: string
  label: string
  children?: CascaderOption[]
}

interface CascaderProps {
  options: CascaderOption[]
  mode: 'single' | 'multiple'
  placeholder?: string
  value?: string[]
  onChange?: (value: string[]) => void
  width?: number
}

export default function Cascader({
  options,
  mode,
  placeholder = '请选择',
  value = [],
  onChange,
  width = 240,
}: CascaderProps) {
  const [open, setOpen] = useState(false)
  const [activePath, setActivePath] = useState<string[]>([])
  const [selectedValues, setSelectedValues] = useState<string[]>(value)
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // 搜索防抖 300ms
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchValue)
    }, 300)
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchValue])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const findOption = (opts: CascaderOption[], key: string): CascaderOption | null => {
    for (const opt of opts) {
      if (opt.value === key) return opt
      if (opt.children) {
        const found = findOption(opt.children, key)
        if (found) return found
      }
    }
    return null
  }

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder
    if (mode === 'single') {
      const opt = findOption(options, selectedValues[0])
      return opt ? opt.label : placeholder
    }
    return `已选 ${selectedValues.length} 项`
  }

  const handleSelect = (opt: CascaderOption, _path: string[]) => {
    if (mode === 'single') {
      setSelectedValues([opt.value])
      setOpen(false)
      onChange?.([opt.value])
    } else {
      // 多选模式不关闭面板
      const newValues = selectedValues.includes(opt.value)
        ? selectedValues.filter((v) => v !== opt.value)
        : [...selectedValues, opt.value]
      setSelectedValues(newValues)
      onChange?.(newValues)
    }
  }

  const handleConfirm = useCallback(() => {
    setOpen(false)
    onChange?.(selectedValues)
  }, [selectedValues, onChange])

  const handleHover = (key: string) => {
    setActivePath((prev) => {
      const idx = prev.indexOf(key)
      if (idx >= 0) return prev.slice(0, idx + 1)
      return [...prev, key]
    })
  }

  const renderOptions = (opts: CascaderOption[], _level: number, path: string[]) => {
    return opts
      .filter((opt) => !debouncedSearch || opt.label.includes(debouncedSearch))
      .map((opt) => {
        const currentPath = [...path, opt.value]
        const isSelected = selectedValues.includes(opt.value)
        const hasChildren = opt.children && opt.children.length > 0
        const isActive = activePath.includes(opt.value)

        return (
          <div
            key={opt.value}
            className={`${styles['cascader-option']} ${isSelected ? styles.selected : ''}`}
            onClick={() => handleSelect(opt, currentPath)}
            onMouseEnter={() => hasChildren && handleHover(opt.value)}
          >
            {mode === 'multiple' && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                style={{ marginRight: 8 }}
              />
            )}
            <span style={{ flex: 1 }}>{opt.label}</span>
            {hasChildren && <span style={{ color: '#999' }}>{isActive ? '▼' : '▶'}</span>}
          </div>
        )
      })
  }

  const renderColumns = () => {
    const result: JSX.Element[] = []
    let currentOptions = options
    const currentPath: string[] = []

    for (let level = 0; level < 5; level++) {
      if (currentOptions.length === 0) break

      result.push(
        <div key={level} className={styles['cascader-column']}>
          {renderOptions(currentOptions, level, currentPath)}
        </div>
      )

      if (activePath[level]) {
        const activeOption = currentOptions.find((o) => o.value === activePath[level])
        if (activeOption?.children) {
          currentOptions = activeOption.children
          currentPath.push(activePath[level])
        } else {
          break
        }
      } else {
        break
      }
    }

    return result
  }

  return (
    <div className={styles['cascader-wrapper']} ref={wrapperRef}>
      <div
        className={`${styles['cascader-input']} ${!selectedValues.length ? styles.placeholder : ''}`}
        style={{ width }}
        onClick={() => setOpen(!open)}
      >
        <span>{getDisplayText()}</span>
        <span>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className={styles['cascader-panel']}>
          {mode === 'multiple' && (
            <div className={styles['cascader-column']}>
              <div className={styles['cascader-search']}>
                <input
                  placeholder="搜索"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          )}
          {renderColumns()}
          {mode === 'multiple' && (
            <div className={styles['cascader-footer']}>
              <span>已选 {selectedValues.length} 项</span>
              <button className={styles['confirm-btn']} onClick={handleConfirm}>
                确认
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
