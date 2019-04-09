package vn.ssdc.vnpt.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SsdcErpApplication {
	public static void main(String[] args) {
		SpringApplication.run(SsdcErpApplication.class, args);
	}
}
