import React from 'react'
import DocSidebarItem from '@theme-original/DocSidebarItem'

// This component is needed to apply custom style to sidebar action items according to their type
// See https://docusaurus.io/docs/swizzling#wrapping

export default function DocSidebarItemWrapper({
  item,
  ...props
}) {
  if (item.customProps?.sidebarActionTitle) {
    return (
      <DocSidebarItem
        item={{
          ...item,
          className: [
            item.className,
            'sidebar-action-title'
          ]
            .filter(Boolean)
            .join(' ')
        }}
        {...props}
      />
    )
  }

  if (item.customProps?.sidebarActionType !== undefined) {
    return (
      <DocSidebarItem
        item={{
          ...item,
          label: (
            <div
              className={[
                'sidebar-action-item',
                `sidebar-action-item-${item.customProps.sidebarActionType}`
              ].join(' ')}
            >
              {item.label}
            </div>
          )
        }}
        {...props}
        style={{ padding: '1px 6px' }}
      />
    )
  }

  return <DocSidebarItem item={item} {...props} />
}
