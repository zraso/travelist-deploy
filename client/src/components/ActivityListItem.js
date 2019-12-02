import React, { useState } from "react";

function ActivityListItem({ id, name, select, deselect }) {

  const [isSelected, setSelected] = useState(false);

  const toggleCheckbox = e => {
    if (isSelected) {
      deselect(id);
      setSelected(false);
    } else {
      select(name);
      setSelected(true);
    }
  }

  return (
    <div className="activity-list-item" data-cy="activity-list-item">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={toggleCheckbox}
      />
      <label data-cy="activity-name"> &nbsp;
        {name}
      </label>
    </div>
  );
}

export default ActivityListItem;