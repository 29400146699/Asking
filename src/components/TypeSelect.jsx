import React from "react";
import { Tag, Space } from "antd";
import styles from "../css/TypeSelect.module.css";
import { tagColorMap } from "../utils/tagColors";

function TypeSelect({ typeList = [], value = "", onChange }) {
  const variants = ["solid", "outlined"]; 

  const isSelected = (typeId) => String(value) === String(typeId);

  return (
    <div className={styles.container}>
        <Space wrap size={[8, 8]}>
      {/* 全部 */}
      <Tag
        color="blue"
        variant={value === "" ? variants[0] : variants[1]}
        style={{ cursor: "pointer" }}
        onClick={() => onChange?.("")}
      >
        全部
      </Tag>

      {/* 分类 */}
      {typeList.map((t) => {
        const selected = isSelected(t.typeId);

        const color = tagColorMap[t.typeName] || "default";

        return (
          <Tag
            key={t.typeId}
            color={color}
            variant={selected ? variants[0] : variants[1]}
            style={{ cursor: "pointer" }}
            onClick={() => onChange?.(t.typeId)}
          >
            {t.typeName}
          </Tag>
        );
      })}
      </Space>
    </div>
  );
}

export default TypeSelect;