package staj.spring.ticket_webapp.base;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.lang.reflect.Field;
import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass //to include fields in the child tables
@EntityListeners(AuditingEntityListener.class) //to automatically update the created/updated columns
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    private void fixStringFields() {
        Class<?> currentClass = this.getClass();

        for (Field field : currentClass.getDeclaredFields()) {
            try {
                if (field.getType().equals(String.class) && !field.getName().equals("mail")
                        && !field.getName().equals("password") && !field.getName().equals("plate")) {
                        field.setAccessible(true);
                        String value = (String) field.get(this);

                        if (value != null) {
                            field.set(this, value.substring(0,1).toUpperCase() + value.substring(1).toLowerCase());
                        }
                } else if (field.getName().equals("mail")) {
                    field.setAccessible(true);
                    String value = (String) field.get(this);

                    if (value != null) {
                        field.set(this, value.toLowerCase());
                    }
                } else if (field.getName().equals("plate")) {
                    field.setAccessible(true);
                    String value = (String) field.get(this);

                    if (value != null) {
                        field.set(this, value.toUpperCase());
                    }
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException("Failed to lowercase field: " + field.getName(), e);
            }
        }
    }

}
