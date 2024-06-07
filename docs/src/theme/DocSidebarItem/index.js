import React from 'react'
import DocSidebarItem from '@theme-original/DocSidebarItem'

// This component is needed to apply custom style to sidebar action items according to their type
// See https://docusaurus.io/docs/swizzling#wrapping

export default function DocSidebarItemWrapper({
  item,
  ...props
}) {
  const classNames = [item.className]
  const style = {}
  let label = item.label

  if (item.customProps?.sidebarActionTitle) {
    classNames.push('sidebar-action-title')
  }

  if (item.customProps?.sidebarActionType !== undefined) {
    label = (
      <div
        className={[
          'sidebar-action-item',
          `sidebar-action-item-${item.customProps.sidebarActionType}`
        ].join(' ')}
      >
        {label}
      </div>
    )
    style.padding = '1px 6px'
  }

  if (item.customProps?.code === true) {
    label = <code>{label}</code>
  }

  return (
    <DocSidebarItem
      item={{
        ...item,
        className: classNames.filter(Boolean).join(' '),
        label
      }}
      {...props}
      style={style}
    />
  )
}
